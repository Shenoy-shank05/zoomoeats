import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get('mine')
  findUserOrders(@CurrentUser('id') userId: string) {
    return this.ordersService.findUserOrders(userId);
  }

  @Get('restaurant/:restaurantId')
  getRestaurantOrders(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.ordersService.getRestaurantOrders(restaurantId, userId);
  }

  @Get('driver/:driverId')
  getDriverOrders(@Param('driverId') driverId: string) {
    return this.ordersService.getDriverOrders(driverId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.ordersService.findOne(id, userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @CurrentUser('id') userId: string,
  ) {
    return this.ordersService.updateStatus(id, status, userId);
  }

  @Patch(':id/assign-driver')
  assignDriver(
    @Param('id') orderId: string,
    @Body('driverId') driverId: string,
  ) {
    return this.ordersService.assignDriver(orderId, driverId);
  }
}
