import { IsString, Matches, Length, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Enter a valid Indian mobile number' })
  phone: string;

  @IsString()
  @Length(4, 4)
  otp: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  password?: string;

  @IsOptional()
  @IsString()
  villageId?: string;
}
