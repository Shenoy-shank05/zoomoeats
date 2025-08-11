import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { AuthGuard } from '../common/auth.guard'
import { CurrentUser } from '../common/current-user.decorator'
import { CreateOrderDto } from './dto/create-order.dto'

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private svc: OrdersService) {}

  @Get('mine')
  mine(@CurrentUser() u: any) { return this.svc.mine(u.sub) }

  @Get(':id')
  one(@Param('id') id: string) { return this.svc.one(id) }

  @Post()
  create(@CurrentUser() u: any, @Body() dto: CreateOrderDto) { 
    return this.svc.create(u.sub, dto as any) 
  }
}
