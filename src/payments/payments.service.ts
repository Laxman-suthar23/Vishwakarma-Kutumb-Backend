import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto';

/**
 * Mock payment charge, mirroring the RN app's `paymentsService.createPayment`.
 *
 * To go live with Razorpay:
 *   1. POST https://api.razorpay.com/v1/orders to create an order for
 *      dto.amount (server-side, using your key secret) instead of the
 *      random-outcome simulation below.
 *   2. Return { orderId, razorpayKeyId } to the client, which opens the
 *      Razorpay Checkout SDK with that order.
 *   3. Verify the payment signature on Razorpay's webhook
 *      (POST /payments/webhook, not implemented here) before marking this
 *      Payment row `success` — never trust a client-reported success.
 * Everything downstream (Payment model, ad status transition to
 * pending_approval) stays the same.
 */
@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.payment.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreatePaymentDto) {
    // Simulate gateway latency + occasional decline, same as the RN mock,
    // so the client's retry path stays exercised against this backend too.
    await new Promise(resolve => setTimeout(resolve, 1200));
    const failed = Math.random() < 0.1;

    return this.prisma.payment.create({
      data: {
        adId: dto.adId,
        businessName: dto.businessName,
        amount: dto.amount,
        method: dto.method,
        status: failed ? 'failed' : 'success',
      },
    });
  }
}
