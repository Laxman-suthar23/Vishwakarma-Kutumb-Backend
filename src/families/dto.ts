import { IsOptional, IsString } from 'class-validator';

export class CreateFamilyDto {
  @IsString() villageId: string;
  @IsString() surname: string;
  @IsOptional() @IsString() address?: string;
}
