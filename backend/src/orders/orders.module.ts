import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'

@Module({ 
  imports: [JwtModule],
  providers: [OrdersService], 
  controllers: [OrdersController] 
})
export class OrdersModule {}
