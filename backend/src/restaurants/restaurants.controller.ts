import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { RestaurantsService } from './restaurants.service'
import { CreateRestaurantDto } from './dto/create-restaurant.dto'
import { ListRestaurantsDto } from './dto/list-restaurants.dto'
import { AuthGuard } from '../common/auth.guard'

@Controller('restaurants')
export class RestaurantsController {
  constructor(private svc: RestaurantsService) {}

  @Get()
  list(@Query() q: ListRestaurantsDto) { return this.svc.list(q) }

  @Get(':id')
  one(@Param('id') id: string) { return this.svc.byId(id) }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateRestaurantDto) { return this.svc.create(dto as any) }
}
