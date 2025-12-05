import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get cart for a user.
   * If cart doesn't exist, creates an empty cart.
   */
  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            dish: {
              include: {
                restaurant: {
                  select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              dish: {
                include: {
                  restaurant: {
                    select: {
                      id: true,
                      name: true,
                      imageUrl: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  /**
   * Add or update an item in the cart.
   * quantity from DTO is treated as FINAL quantity (not an increment).
   * If cart has items from another restaurant, clears it first.
   */
  async addItem(userId: string, addItemDto: AddItemDto) {
  const { dishId, quantity, specialInstructions } = addItemDto;

  if (quantity <= 0) {
    throw new BadRequestException('Quantity must be a positive integer');
  }

  // 1) Validate dish
  const dish = await this.prisma.dish.findUnique({
    where: { id: dishId },
    include: {
      restaurant: {
        select: { id: true, name: true },
      },
    },
  });

  if (!dish) {
    throw new NotFoundException('Dish not found');
  }

  if (!dish.isAvailable) {
    throw new BadRequestException('Dish is not available');
  }

  // 2) Ensure cart exists (WITHOUT relying on items)
  let cart = await this.prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await this.prisma.cart.create({
      data: { userId },
    });
  }

  // 3) Enforce single-restaurant cart:
  //    Look at *one* existing item (if any) to determine cart restaurant
  const anyExistingItem = await this.prisma.cartItem.findFirst({
    where: { cartId: cart.id },
    include: {
      dish: {
        include: { restaurant: true },
      },
    },
  });

  if (anyExistingItem) {
    const existingRestaurantId = anyExistingItem.dish.restaurant.id;
    if (existingRestaurantId !== dish.restaurant.id) {
      await this.clearCart(userId);
      // cart row still exists, just empty items
    }
  }

  // 4) Load ALL items for this cart + dish to avoid duplicates
  const itemsForDish = await this.prisma.cartItem.findMany({
    where: {
      cartId: cart.id,
      dishId,
    },
  });

  await this.prisma.$transaction(async (tx) => {
    if (itemsForDish.length === 0) {
      // No existing item at all → create
      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          dishId,
          quantity,
          specialInstructions,
        },
      });
    } else {
      const [primary, ...duplicates] = itemsForDish;

      // If there were duplicates before, remove the extras
      if (duplicates.length > 0) {
        await tx.cartItem.deleteMany({
          where: {
            id: { in: duplicates.map((d) => d.id) },
          },
        });
      }

      // Update the remaining row with the FINAL quantity
      await tx.cartItem.update({
        where: { id: primary.id },
        data: {
          quantity,
          specialInstructions,
        },
      });
    }
  });

  // 5) Return fresh cart with items + dish + restaurant info
  return this.getCart(userId);
}


  /**
   * Update quantity and/or special instructions for a cart item.
   * quantity is final value; 0 removes the item.
   */
  async updateItem(
    userId: string,
    itemId: string,
    updateItemDto: UpdateItemDto,
  ) {
    const { quantity, specialInstructions } = updateItemDto;

    if (quantity < 0) {
      throw new BadRequestException('Quantity must be a non-negative integer');
    }

    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity === 0) {
      await this.prisma.cartItem.delete({
        where: { id: itemId },
      });
      return { message: 'Item removed from cart' };
    }

    const updatedItem = await this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity,
        specialInstructions,
      },
      include: {
        dish: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    return updatedItem;
  }

  /**
   * Remove a single item from the cart.
   */
  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removed from cart' };
  }

  /**
   * Clear all items from the user's cart.
   */
  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { message: 'Cart cleared successfully' };
  }

  /**
   * Get cart plus a price summary (subtotal, tax, deliveryFee, total).
   */
  async getCartSummary(userId: string) {
    const cart = await this.getCart(userId);

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.dish.price * item.quantity,
      0,
    );

    const deliveryFee = cart.items.length > 0 ? 49 : 0;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + tax;

    return {
      cart,
      summary: {
        subtotal,
        deliveryFee,
        tax,
        total,
        itemCount: cart.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        ),
      },
    };
  }
}
