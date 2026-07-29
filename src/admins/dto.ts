import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateAdminDto {
  @IsString() name: string;
  @IsString() phone: string;
  @IsOptional() @IsString() email?: string;
  @IsString() password?: string;
  @IsEnum(UserRole) role: Extract<UserRole, 'village_admin' | 'super_admin'>;
  @IsOptional() @IsString() villageId?: string;
}

export class UpdateAdminDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() password?: string;
  @IsOptional() @IsEnum(UserRole) role?: Extract<UserRole, 'village_admin' | 'super_admin'>;
  @IsOptional() @IsString() villageId?: string;
}
