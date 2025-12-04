import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards, 
  ValidationPipe 
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { ListRestaurantsDto } from './dto/list-restaurants.dto';
import { JwtAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: any,
    @Body(ValidationPipe) createRestaurantDto: CreateRestaurantDto,
  ) {
    return this.restaurantsService.create(user.id, createRestaurantDto);
  }

  @Get()
  findAll(@Query(ValidationPipe) query: ListRestaurantsDto) {
    return this.restaurantsService.findAll(query);
  }

  @Get('my-restaurants')
  @UseGuards(JwtAuthGuard)
  getMyRestaurants(@CurrentUser() user: any) {
    return this.restaurantsService.getMyRestaurants(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body(ValidationPipe) updateRestaurantDto: Partial<CreateRestaurantDto>,
  ) {
    return this.restaurantsService.update(id, user.id, updateRestaurantDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.restaurantsService.remove(id, user.id);
  }

  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  addReview(
    @Param('id') restaurantId: string,
    @CurrentUser() user: any,
    @Body() reviewData: { rating: number; comment?: string },
  ) {
    return this.restaurantsService.addReview(
      restaurantId,
      user.id,
      reviewData.rating,
      reviewData.comment,
    );
  }
}
