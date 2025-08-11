import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { AuthGuard } from '../common/auth.guard'

@Controller('payments')
@UseGuards(AuthGuard)
export class PaymentsController {
  constructor(private svc: PaymentsService) {}
  
  @Post('intent')
  intent(@Body('total') total: number) { 
    return this.svc.intent(total) 
  }

  @Post('confirm')
  confirm(@Body('paymentIntentId') paymentIntentId: string) {
    return this.svc.confirm(paymentIntentId)
  }
}
