import { IsBoolean, IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import { Gender, MaritalStatus } from '@prisma/client';

export class CreateMemberDto {
  @IsString() familyId: string;
  @IsString() villageId: string;
  @IsString() name: string;
  @IsString() gender: Gender;
  @IsString() relation: string;
  @IsOptional() @IsInt() age?: number;
  @IsOptional() @IsString() occupation?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() dob?: string;
  @IsOptional() @IsString() education?: string;
  @IsOptional() @IsString() caste?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsEnum(MaritalStatus) maritalStatus?: MaritalStatus;
  @IsOptional() @IsString() photoUrl?: string;
}

export class UpdateMemberDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() relation?: string;
  @IsOptional() @IsInt() age?: number;
  @IsOptional() @IsString() occupation?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() dob?: string;
  @IsOptional() @IsString() education?: string;
  @IsOptional() @IsString() caste?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsEnum(MaritalStatus) maritalStatus?: MaritalStatus;
  @IsOptional() @IsBoolean() isFamilyHead?: boolean;
  @IsOptional() @IsString() photoUrl?: string;
}
