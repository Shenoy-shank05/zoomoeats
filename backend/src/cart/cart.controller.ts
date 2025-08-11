import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { CartService } from './cart.service'
import { AuthGuard } from '../common/auth.guard'
import { CurrentUser } from '../common/current-user.decorator'
import { AddItemDto } from './dto/add-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private svc: CartService) {}

  @Get()
  get(@CurrentUser() u: any) { return this.svc.get(u.sub) }

  @Post('items')
  add(@CurrentUser() u: any, @Body() dto: AddItemDto) { 
    return this.svc.add(u.sub, dto as any) 
  }

  @Patch('items/:id')
  update(@Param('id') id: string, @Body() dto: UpdateItemDto) { 
    return this.svc.update(id, dto.qty) 
  }

  @Delete('items/:id')
  del(@Param('id') id: string) { return this.svc.remove(id) }

  @Delete('items')
  clear(@CurrentUser() u: any) { return this.svc.clear(u.sub) }
}
