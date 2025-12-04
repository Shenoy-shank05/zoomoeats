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
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { JwtAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: any,
    @Body(ValidationPipe) createDishDto: CreateDishDto,
  ) {
    return this.dishesService.create(user.id, createDishDto);
  }

  @Get()
  findAll(@Query('restaurantId') restaurantId?: string) {
    return this.dishesService.findAll(restaurantId);
  }

  @Get('search')
  searchDishes(@Query('q') query: string) {
    return this.dishesService.searchDishes(query);
  }

  @Get('popular')
  getPopularDishes(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.dishesService.getPopularDishes(limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body(ValidationPipe) updateDishDto: Partial<CreateDishDto>,
  ) {
    return this.dishesService.update(id, user.id, updateDishDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.dishesService.remove(id, user.id);
  }
}
