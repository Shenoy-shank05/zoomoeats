import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PaymentsService } from './payments.service'
import { PaymentsController } from './payments.controller'

@Module({ 
  imports: [JwtModule],
  providers: [PaymentsService], 
  controllers: [PaymentsController] 
})
export class PaymentsModule {}
