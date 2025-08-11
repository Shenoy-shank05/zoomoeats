import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}
  
  get(userId: string) { 
    return this.prisma.cart.findUnique({ 
      where: { userId }, 
      include: { 
        items: {
          include: {
            dish: {
              select: {
                id: true,
                name: true,
                price: true,
                imgUrl: true,
                isVeg: true,
                restaurant: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        } 
      } 
    }) 
  }
  
  async add(userId: string, data: any) {
    await this.prisma.cart.upsert({ 
      where: { userId }, 
      update: {}, 
      create: { userId } 
    })
    
    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: userId,
        dishId: data.dishId
      }
    })

    if (existingItem) {
      // Update quantity if item exists
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { qty: existingItem.qty + data.qty }
      })
    } else {
      // Create new item if it doesn't exist
      return this.prisma.cartItem.create({ 
        data: { cartId: userId, ...data } 
      })
    }
  }
  
  update(itemId: string, qty: number) { 
    return this.prisma.cartItem.update({ 
      where: { id: itemId }, 
      data: { qty } 
    }) 
  }
  
  remove(itemId: string) { 
    return this.prisma.cartItem.delete({ 
      where: { id: itemId } 
    }) 
  }
  
  clear(userId: string) { 
    return this.prisma.cartItem.deleteMany({ 
      where: { cartId: userId } 
    }) 
  }
}
