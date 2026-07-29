import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateVillageDto {
  @IsString() name: string;
  @IsOptional() @IsString() nameLocal?: string;
  @IsString() district: string;
  @IsString() state: string;
  @IsOptional() @IsString() adminName?: string;
  @IsOptional() @IsString() coverImageUrl?: string;
}

export class UpdateVillageDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() nameLocal?: string;
  @IsOptional() @IsString() district?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() adminName?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() coverImageUrl?: string;
  @IsOptional() @IsInt() establishedYear?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}
