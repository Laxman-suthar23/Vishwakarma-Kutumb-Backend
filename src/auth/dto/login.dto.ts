import { IsString, Matches, MinLength, IsEmail } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Enter a valid Indian mobile number' })
  phone: string;

  @IsString()
  @MinLength(4)
  password: string;
}

export class AdminLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}
