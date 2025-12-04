import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent')
  createPaymentIntent(@Body('total') total: number) {
    return this.paymentsService.createPaymentIntent(total);
  }

  @Post('process')
  processPayment(
    @Body('orderId') orderId: string,
    @Body('paymentIntentId') paymentIntentId: string,
  ) {
    return this.paymentsService.processPayment(orderId, paymentIntentId);
  }

  @Get('order/:orderId')
  getPayment(@Param('orderId') orderId: string) {
    return this.paymentsService.getPayment(orderId);
  }

  @Post('refund/:orderId')
  refundPayment(@Param('orderId') orderId: string) {
    return this.paymentsService.refundPayment(orderId);
  }

  @Get('history')
  getPaymentHistory(@CurrentUser('id') userId: string) {
    return this.paymentsService.getPaymentHistory(userId);
  }

  @Post('webhook')
  handleWebhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }
}
