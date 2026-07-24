import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { AdProduct, AdStatus } from '@prisma/client';

export class CreateAdDto {
  @IsString() title: string;
  @IsString() businessName: string;
  @IsEnum(AdProduct) product: AdProduct;
  @IsOptional() @IsString() villageId?: string;
  @IsInt() @Min(0) price: number;
  @IsOptional() @IsString() imageUrl?: string;
}

export class UpdateAdStatusDto {
  @IsEnum(AdStatus) status: AdStatus;
}
