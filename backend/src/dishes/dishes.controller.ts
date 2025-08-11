import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { DishesService } from './dishes.service'
import { CreateDishDto } from './dto/create-dish.dto'
import { AuthGuard } from '../common/auth.guard'

@Controller('dishes')
export class DishesController {
  constructor(private svc: DishesService) {}

  @Get()
  list(@Query('restaurantId') restaurantId: string) { 
    return this.svc.byRestaurant(restaurantId) 
  }

  @Get(':id')
  one(@Param('id') id: string) { 
    return this.svc.byId(id) 
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateDishDto) { 
    return this.svc.create(dto as any) 
  }
}
