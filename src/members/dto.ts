import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateMemberDto {
  @IsString() familyId: string;
  @IsString() villageId: string;
  @IsString() name: string;
  @IsString() gender: Gender;
  @IsString() relation: string;
  @IsOptional() @IsInt() age?: number;
  @IsOptional() @IsString() occupation?: string;
  @IsOptional() @IsString() phone?: string;
}

export class UpdateMemberDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() relation?: string;
  @IsOptional() @IsInt() age?: number;
  @IsOptional() @IsString() occupation?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsBoolean() isFamilyHead?: boolean;
}
