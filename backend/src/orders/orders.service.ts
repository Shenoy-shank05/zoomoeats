import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { restaurantId, items, addressId, specialInstructions } = createOrderDto;

    // Verify restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Verify address belongs to user
    if (addressId) {
      const address = await this.prisma.address.findFirst({
        where: { id: addressId, userId },
      });

      if (!address) {
        throw new NotFoundException('Address not found or does not belong to user');
      }
    }

    // Verify all dishes exist and calculate total
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const dish = await this.prisma.dish.findUnique({
        where: { id: item.dishId },
      });

      if (!dish) {
        throw new NotFoundException(`Dish with id ${item.dishId} not found`);
      }

      if (!dish.isAvailable) {
        throw new BadRequestException(`Dish ${dish.name} is not available`);
      }

      if (dish.restaurantId !== restaurantId) {
        throw new BadRequestException(`Dish ${dish.name} does not belong to the selected restaurant`);
      }

      const itemTotal = dish.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        dishId: item.dishId,
        quantity: item.quantity,
        price: dish.price,
        specialInstructions: item.specialInstructions,
      });
    }

    // Calculate fees and total
    const deliveryFee = 49; // Fixed delivery fee
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + deliveryFee + tax;

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        userId,
        restaurantId,
        addressId,
        status: OrderStatus.PENDING,
        subtotal,
        deliveryFee,
        tax,
        total,
        specialInstructions,
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        restaurant: true,
        address: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Clear user's cart after successful order
    await this.prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId,
        },
      },
    });

    return order;
  }
  async createOrder(userId: string, dto: CreateOrderDto) {
  const { addressId, specialInstructions} = dto;

  const cart = await this.prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          dish: {
            include: { restaurant: true },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new BadRequestException('Cart is empty');
  }

  const restaurant = cart.items[0].dish.restaurant;

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0,
  );
  const deliveryFee = cart.items.length > 0 ? 49 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax ;

  // (Optional) validate address belongs to user...

  const order = await this.prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        restaurantId: restaurant.id,
        addressId: addressId || undefined,
        status: 'PENDING',
        subtotal,
        deliveryFee,
        tax,
        total,
        specialInstructions,
        items: {
          create: cart.items.map((item) => ({
            dishId: item.dishId,
            quantity: item.quantity,
            price: item.dish.price,
            specialInstructions: item.specialInstructions,
          })),
        },
      },
      include: {
        items: { include: { dish: true } },
        restaurant: true,
      },
    });

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return createdOrder;
  });

  return order;
}


  async findUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            dish: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        address: true,
        driver: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        restaurant: true,
        address: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        driver: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if user owns the order or is the restaurant owner or driver
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: order.restaurantId },
      select: { ownerId: true },
    });

    const canAccess = 
      order.userId === userId || 
      restaurant?.ownerId === userId || 
      order.driver?.userId === userId;

    if (!canAccess) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: { ownerId: true },
        },
        driver: {
          select: { userId: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check permissions based on status change
    const canUpdate = 
      (status === OrderStatus.PREPARING && order.restaurant.ownerId === userId) ||
      (status === OrderStatus.READY_FOR_PICKUP && order.restaurant.ownerId === userId) ||
      (status === OrderStatus.OUT_FOR_DELIVERY && order.driver?.userId === userId) ||
      (status === OrderStatus.DELIVERED && order.driver?.userId === userId) ||
      (status === OrderStatus.CANCELLED && (order.userId === userId || order.restaurant.ownerId === userId));

    if (!canUpdate) {
      throw new ForbiddenException('You do not have permission to update this order status');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { 
        status,
        actualDeliveryTime: status === OrderStatus.DELIVERED ? new Date() : undefined,
      },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        restaurant: true,
        address: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        driver: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    return updatedOrder;
  }

  async assignDriver(orderId: string, driverId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.READY_FOR_PICKUP) {
      throw new BadRequestException('Order must be ready for pickup to assign driver');
    }

    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    if (!driver.isAvailable) {
      throw new BadRequestException('Driver is not available');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        driverId,
        status: OrderStatus.OUT_FOR_DELIVERY,
      },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        restaurant: true,
        address: true,
        driver: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    // Mark driver as unavailable
    await this.prisma.driver.update({
      where: { id: driverId },
      data: { isAvailable: false },
    });

    return updatedOrder;
  }

  async getRestaurantOrders(restaurantId: string, userId: string) {
    // Verify user owns the restaurant
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { ownerId: true },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.ownerId !== userId) {
      throw new ForbiddenException('You do not own this restaurant');
    }

    const orders = await this.prisma.order.findMany({
      where: { restaurantId },
      include: {
        items: {
          include: {
            dish: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        address: true,
        driver: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  }

  async getDriverOrders(driverId: string) {
    const orders = await this.prisma.order.findMany({
      where: { driverId },
      include: {
        items: {
          include: {
            dish: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  }
}
