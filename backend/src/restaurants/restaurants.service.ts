import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { ListRestaurantsDto } from './dto/list-restaurants.dto';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createRestaurantDto: CreateRestaurantDto) {
    const restaurant = await this.prisma.restaurant.create({
      data: {
        ...createRestaurantDto,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return restaurant;
  }

  async findAll(query: ListRestaurantsDto) {
    const { cuisineType, priceRange, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (cuisineType) {
      where.cuisineType = {
        contains: cuisineType,
        mode: 'insensitive',
      };
    }

    if (priceRange) {
      where.priceRange = priceRange;
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          cuisineType: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [restaurants, total] = await Promise.all([
      this.prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        include: {
          dishes: {
            where: { isAvailable: true },
            take: 3, // Show first 3 dishes as preview
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
          _count: {
            select: {
              dishes: {
                where: { isAvailable: true },
              },
              reviews: true,
            },
          },
        },
        orderBy: {
          rating: 'desc',
        },
      }),
      this.prisma.restaurant.count({ where }),
    ]);

    return {
      data: restaurants,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        dishes: {
          where: { isAvailable: true },
          orderBy: { name: 'asc' },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            dishes: {
              where: { isAvailable: true },
            },
            reviews: true,
          },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async update(id: string, userId: string, updateData: Partial<CreateRestaurantDto>) {
    // Check if user owns the restaurant
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own restaurants');
    }

    const updatedRestaurant = await this.prisma.restaurant.update({
      where: { id },
      data: updateData,
    });

    return updatedRestaurant;
  }

  async remove(id: string, userId: string) {
    // Check if user owns the restaurant
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own restaurants');
    }

    await this.prisma.restaurant.delete({
      where: { id },
    });

    return { message: 'Restaurant deleted successfully' };
  }

  async getMyRestaurants(userId: string) {
    const restaurants = await this.prisma.restaurant.findMany({
      where: { ownerId: userId },
      include: {
        _count: {
          select: {
            dishes: true,
            orders: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return restaurants;
  }

  async addReview(restaurantId: string, userId: string, rating: number, comment?: string) {
    // Check if restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        restaurantId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Update restaurant rating
    const reviews = await this.prisma.review.findMany({
      where: { restaurantId },
      select: { rating: true },
    });

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await this.prisma.restaurant.update({
      where: { id: restaurantId },
      data: { rating: averageRating },
    });

    return review;
  }
}
