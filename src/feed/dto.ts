import { IsOptional, IsString } from 'class-validator';

export class CreateFeedDto {
  @IsString() authorName: string;
  @IsString() content: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() villageId?: string;
}

export class UpdateFeedDto {
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() imageUrl?: string;
}
