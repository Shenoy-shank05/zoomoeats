import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPaymentIntent(total: number) {
    // Mock payment intent creation
    // In a real app, you would integrate with Stripe, PayPal, etc.
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      status: 'requires_payment_method',
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
    };

    return paymentIntent;
  }

  async processPayment(orderId: string, paymentIntentId: string) {
    // Check if order exists
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if payment already exists
    const existingPayment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (existingPayment) {
      throw new BadRequestException('Payment already processed for this order');
    }

    // Mock payment processing
    // In a real app, you would verify the payment with your payment provider
    const paymentStatus = Math.random() > 0.1 ? 'COMPLETED' : 'FAILED'; // 90% success rate

    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        amount: order.total,
        currency: 'USD',
        status: paymentStatus,
        provider: 'STRIPE',
        paymentIntentId,
        receiptUrl: paymentStatus === 'COMPLETED' 
          ? `https://receipt.example.com/${paymentIntentId}` 
          : null,
      },
    });

    return payment;
  }

  async getPayment(orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: {
        order: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async refundPayment(orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'COMPLETED') {
      throw new BadRequestException('Can only refund completed payments');
    }

    // Mock refund processing
    // In a real app, you would process the refund with your payment provider
    const updatedPayment = await this.prisma.payment.update({
      where: { orderId },
      data: {
        status: 'REFUNDED',
      },
    });

    return updatedPayment;
  }

  async getPaymentHistory(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: {
        order: {
          userId,
        },
      },
      include: {
        order: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
            restaurant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return payments;
  }

  // Mock webhook handler for payment provider notifications
  async handleWebhook(payload: any) {
    // In a real app, you would verify the webhook signature
    // and process the payment status updates
    
    const { paymentIntentId, status } = payload;
    
    const payment = await this.prisma.payment.findFirst({
      where: { paymentIntentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status },
    });

    return updatedPayment;
  }
}
