import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  ValidationPipe 
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: any) {
    return this.cartService.getCart(user.id);
  }

  @Get('summary')
  getCartSummary(@CurrentUser() user: any) {
    return this.cartService.getCartSummary(user.id);
  }

  @Post('items')
  addItem(
    @CurrentUser() user: any,
    @Body(ValidationPipe) addItemDto: AddItemDto,
  ) {
    return this.cartService.addItem(user.id, addItemDto);
  }

  @Patch('items/:id')
  updateItem(
    @CurrentUser() user: any,
    @Param('id') itemId: string,
    @Body(ValidationPipe) updateItemDto: UpdateItemDto,
  ) {
    return this.cartService.updateItem(user.id, itemId, updateItemDto);
  }

  @Delete('items/:id')
  removeItem(@CurrentUser() user: any, @Param('id') itemId: string) {
    return this.cartService.removeItem(user.id, itemId);
  }

  @Delete('items')
  clearCart(@CurrentUser() user: any) {
    return this.cartService.clearCart(user.id);
  }
}
