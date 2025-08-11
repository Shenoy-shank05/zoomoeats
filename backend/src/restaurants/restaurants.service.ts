import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}
  
  create(data: any) { 
    return this.prisma.restaurant.create({ data }) 
  }
  
  list(filter: any) {
    const where: any = {}
    if (filter.q) where.name = { contains: filter.q, mode: 'insensitive' }
    if (filter.area) where.area = { contains: filter.area, mode: 'insensitive' }
    if (filter.cuisine) where.cuisine = { contains: filter.cuisine, mode: 'insensitive' }
    return this.prisma.restaurant.findMany({ 
      where, 
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        area: true,
        cuisine: true,
        rating: true,
        isOpen: true,
        deliveryFee: true,
        minOrder: true,
        imgUrl: true,
        createdAt: true
      }
    })
  }
  
  byId(id: string) { 
    return this.prisma.restaurant.findUnique({ 
      where: { id }, 
      include: { 
        dishes: {
          where: { isAvailable: true },
          orderBy: { category: 'asc' }
        } 
      } 
    }) 
  }
}
