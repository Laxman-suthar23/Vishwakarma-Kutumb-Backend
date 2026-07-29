import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NotificationCategory, NotificationPriority } from '@prisma/client';

export class CreateNotificationDto {
  @IsEnum(NotificationCategory) category: NotificationCategory;
  @IsString() title: string;
  @IsString() body: string;
  @IsOptional() @IsString() villageId?: string;
  @IsEnum(NotificationPriority) priority: NotificationPriority;
}

export class UpdateNotificationDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() body?: string;
  @IsOptional() @IsEnum(NotificationCategory) category?: NotificationCategory;
  @IsOptional() @IsEnum(NotificationPriority) priority?: NotificationPriority;
}
