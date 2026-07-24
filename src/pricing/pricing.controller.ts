import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AdProduct, UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PricingService } from './pricing.service';
import { UpdatePricingDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pricing')
export class PricingController {
  constructor(private pricingService: PricingService) {}

  @Get()
  findAll() {
    return this.pricingService.findAll();
  }

  @Roles(UserRole.super_admin)
  @Patch(':product')
  update(@Param('product') product: AdProduct, @Body() dto: UpdatePricingDto) {
    return this.pricingService.update(product, dto.price);
  }
}
