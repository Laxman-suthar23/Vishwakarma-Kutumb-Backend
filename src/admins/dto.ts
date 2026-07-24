import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateAdminDto {
  @IsString() name: string;
  @IsString() phone: string;
  @IsEnum(UserRole) role: Extract<UserRole, 'village_admin' | 'super_admin'>;
  @IsOptional() @IsString() villageId?: string;
}
