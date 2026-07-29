import { IsString, Matches, IsOptional, IsIn } from 'class-validator';

export class RequestOtpDto {
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Enter a valid Indian mobile number' })
  phone: string;

  @IsOptional()
  @IsIn(['signup', 'reset'])
  type?: 'signup' | 'reset';
}
