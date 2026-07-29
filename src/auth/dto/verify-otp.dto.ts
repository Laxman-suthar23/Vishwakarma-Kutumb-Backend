import { IsIn, IsOptional, IsString, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Enter a valid Indian mobile number' })
  phone: string;

  @IsString()
  @Length(4, 4)
  otp: string;

  // Exists only so the still-mock-auth RN client can preview all three role
  // experiences before real role assignment/invites are built server-side.
  // Remove once that exists.
  @IsOptional()
  @IsIn(['member', 'village_admin', 'super_admin'])
  demoRole?: 'member' | 'village_admin' | 'super_admin';
}
