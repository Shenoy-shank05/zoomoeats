import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class DishesService {
  constructor(private prisma: PrismaService) {}
  
  create(data: any) { 
    return this.prisma.dish.create({ data }) 
  }
  
  byRestaurant(restaurantId: string) { 
    return this.prisma.dish.findMany({ 
      where: { restaurantId, isAvailable: true },
      orderBy: { category: 'asc' }
    }) 
  }

  byId(id: string) {
    return this.prisma.dish.findUnique({
      where: { id },
      include: { restaurant: true }
    })
  }
}
