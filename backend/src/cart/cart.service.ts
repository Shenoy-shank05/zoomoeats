import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

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

    // Create cart if it doesn't exist
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

  async addItem(userId: string, addItemDto: AddItemDto) {
    const { dishId, qty, priceSnap, specialInstructions } = addItemDto;

    // Verify dish exists and is available
    const dish = await this.prisma.dish.findUnique({
      where: { id: dishId },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!dish) {
      throw new NotFoundException('Dish not found');
    }

    if (!dish.isAvailable) {
      throw new BadRequestException('Dish is not available');
    }

    // Get or create cart
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            dish: {
              include: {
                restaurant: true,
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
                  restaurant: true,
                },
              },
            },
          },
        },
      });
    }

    // Check if adding from different restaurant
    if (cart.items.length > 0) {
      const existingRestaurantId = cart.items[0].dish.restaurantId;
      if (existingRestaurantId !== dish.restaurantId) {
        throw new BadRequestException(
          'Cannot add items from different restaurants. Please clear your cart first.',
        );
      }
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find((item) => item.dishId === dishId);

    if (existingItem) {
      // Update quantity
      const updatedItem = await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + qty,
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
    } else {
      // Add new item
      const newItem = await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          dishId,
          quantity: qty,
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

      return newItem;
    }
  }

  async updateItem(userId: string, itemId: string, updateItemDto: UpdateItemDto) {
    const { qty, specialInstructions } = updateItemDto;

    // Verify item belongs to user's cart
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

    const updatedItem = await this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity: qty,
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

  async removeItem(userId: string, itemId: string) {
    // Verify item belongs to user's cart
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

  async getCartSummary(userId: string) {
    const cart = await this.getCart(userId);

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.dish.price * item.quantity,
      0,
    );

    const deliveryFee = cart.items.length > 0 ? 49 : 0;
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + deliveryFee + tax;

    return {
      cart,
      summary: {
        subtotal,
        deliveryFee,
        tax,
        total,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    };
  }
}
