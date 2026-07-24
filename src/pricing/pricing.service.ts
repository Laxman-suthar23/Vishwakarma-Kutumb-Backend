import { Injectable } from '@nestjs/common';
import { AdProduct } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.adPricing.findMany();
  }

  update(product: AdProduct, price: number) {
    return this.prisma.adPricing.update({ where: { product }, data: { price } });
  }
}
