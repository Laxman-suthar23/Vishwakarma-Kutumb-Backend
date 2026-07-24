import { IsBoolean, IsEmail, IsOptional } from 'class-validator';

export class UpdatePlatformSettingsDto {
  @IsOptional() @IsBoolean() maintenanceMode?: boolean;
  @IsOptional() @IsBoolean() newRegistrationsEnabled?: boolean;
  @IsOptional() @IsBoolean() otpRequiredForLogin?: boolean;
  @IsOptional() @IsBoolean() adAutoApproval?: boolean;
  @IsOptional() @IsEmail() supportEmail?: string;
}
