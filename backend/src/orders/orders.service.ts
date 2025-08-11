import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { OrderStatus } from '@prisma/client'

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  
  async create(userId: string, data: any) {
    if (!data.items?.length) throw new BadRequestException('no-items')
    
    const order = await this.prisma.order.create({
      data: {
        userId,
        restaurantId: data.restaurantId,
        status: 'PENDING',
        total: data.total,
        deliveryFee: data.deliveryFee,
        tax: data.tax,
        addressSnap: data.addressSnap,
        etaMinutes: 30 + Math.floor(Math.random() * 20), // Random ETA between 30-50 mins
        items: { 
          create: data.items.map((i: any) => ({ 
            dishId: i.dishId, 
            name: i.name, 
            price: i.price, 
            qty: i.qty, 
            custom: i.custom 
          })) 
        }
      },
      include: {
        items: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            area: true
          }
        }
      }
    })
    
    // Clear user's cart after successful order
    await this.prisma.cartItem.deleteMany({ where: { cartId: userId } })
    
    return order
  }
  
  mine(userId: string) { 
    return this.prisma.order.findMany({ 
      where: { userId }, 
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            area: true,
            imgUrl: true
          }
        },
        items: {
          select: {
            id: true,
            name: true,
            price: true,
            qty: true
          }
        }
      }
    }) 
  }
  
  one(id: string) { 
    return this.prisma.order.findUnique({ 
      where: { id }, 
      include: { 
        items: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            area: true,
            cuisine: true,
            imgUrl: true
          }
        }
      } 
    }) 
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status }
    })
  }
}
