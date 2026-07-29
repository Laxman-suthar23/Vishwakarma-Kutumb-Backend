import { IsOptional, IsString } from 'class-validator';

export class CreateFamilyDto {
  @IsString() villageId: string;
  @IsString() headName: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() photoUrl?: string;
  @IsOptional() @IsString() headPhone?: string;
}

export class UpdateFamilyDto {
  @IsOptional() @IsString() headName?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() headMemberId?: string;
  @IsOptional() @IsString() photoUrl?: string;
  @IsOptional() @IsString() headPhone?: string;
}
