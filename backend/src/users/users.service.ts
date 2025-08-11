import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  
  me(id: string) { 
    return this.prisma.user.findUnique({ 
      where: { id },
      select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true }
    }) 
  }

  update(id: string, data: any) {
    return this.prisma.user.update({ 
      where: { id }, 
      data,
      select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true }
    })
  }
}
