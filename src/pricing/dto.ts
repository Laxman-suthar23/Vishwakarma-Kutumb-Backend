import { IsInt, Min } from 'class-validator';

export class UpdatePricingDto {
  @IsInt() @Min(0) price: number;
}
