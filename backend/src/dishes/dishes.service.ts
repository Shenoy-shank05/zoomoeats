import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateDishDto } from './dto/create-dish.dto';

@Injectable()
export class DishesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDishDto: CreateDishDto) {
    const { restaurantId, ...dishData } = createDishDto;

    // Check if user owns the restaurant
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { ownerId: true },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.ownerId !== userId) {
      throw new ForbiddenException('You can only add dishes to your own restaurants');
    }

    const dish = await this.prisma.dish.create({
      data: {
        ...dishData,
        restaurantId,
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return dish;
  }

  async findAll(restaurantId?: string) {
    const where: any = {
      isAvailable: true,
    };

    if (restaurantId) {
      where.restaurantId = restaurantId;
    }

    const dishes = await this.prisma.dish.findMany({
      where,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return dishes;
  }

  async findOne(id: string) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            address: true,
            phone: true,
            openingHours: true,
          },
        },
      },
    });

    if (!dish) {
      throw new NotFoundException('Dish not found');
    }

    return dish;
  }

  async update(id: string, userId: string, updateData: Partial<CreateDishDto>) {
    // Check if dish exists and user owns the restaurant
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: { ownerId: true },
        },
      },
    });

    if (!dish) {
      throw new NotFoundException('Dish not found');
    }

    if (dish.restaurant.ownerId !== userId) {
      throw new ForbiddenException('You can only update dishes from your own restaurants');
    }

    const { restaurantId, ...dishData } = updateData;

    const updatedDish = await this.prisma.dish.update({
      where: { id },
      data: dishData,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedDish;
  }

  async remove(id: string, userId: string) {
    // Check if dish exists and user owns the restaurant
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: { ownerId: true },
        },
      },
    });

    if (!dish) {
      throw new NotFoundException('Dish not found');
    }

    if (dish.restaurant.ownerId !== userId) {
      throw new ForbiddenException('You can only delete dishes from your own restaurants');
    }

    await this.prisma.dish.delete({
      where: { id },
    });

    return { message: 'Dish deleted successfully' };
  }

  async findByRestaurant(restaurantId: string) {
    const dishes = await this.prisma.dish.findMany({
      where: {
        restaurantId,
        isAvailable: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return dishes;
  }

  async searchDishes(query: string) {
    const dishes = await this.prisma.dish.findMany({
      where: {
        isAvailable: true,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            ingredients: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return dishes;
  }

  async getPopularDishes(limit: number = 10) {
    // Get dishes with most orders
    const dishes = await this.prisma.dish.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return dishes;
  }
}
