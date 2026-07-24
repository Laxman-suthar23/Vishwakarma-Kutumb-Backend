import { IsEnum, IsInt, IsString, Min } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @IsString() adId: string;
  @IsString() businessName: string;
  @IsInt() @Min(0) amount: number;
  @IsEnum(PaymentMethod) method: PaymentMethod;
}
