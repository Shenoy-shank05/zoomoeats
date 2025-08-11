import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { RestaurantsService } from './restaurants.service'
import { RestaurantsController } from './restaurants.controller'

@Module({ 
  imports: [JwtModule],
  providers: [RestaurantsService], 
  controllers: [RestaurantsController] 
})
export class RestaurantsModule {}
