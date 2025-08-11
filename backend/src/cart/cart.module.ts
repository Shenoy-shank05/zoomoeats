import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { CartService } from './cart.service'
import { CartController } from './cart.controller'

@Module({ 
  imports: [JwtModule],
  providers: [CartService], 
  controllers: [CartController] 
})
export class CartModule {}
