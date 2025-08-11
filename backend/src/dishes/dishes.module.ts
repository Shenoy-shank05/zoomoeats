import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { DishesService } from './dishes.service'
import { DishesController } from './dishes.controller'

@Module({ 
  imports: [JwtModule],
  providers: [DishesService], 
  controllers: [DishesController] 
})
export class DishesModule {}
