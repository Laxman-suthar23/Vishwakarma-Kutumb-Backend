import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PlatformSettingsService } from './platform-settings.service';
import { UpdatePlatformSettingsDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.super_admin)
@Controller('platform-settings')
export class PlatformSettingsController {
  constructor(private settingsService: PlatformSettingsService) {}

  @Get()
  find() {
    return this.settingsService.find();
  }

  @Patch()
  update(@Body() dto: UpdatePlatformSettingsDto) {
    return this.settingsService.update(dto);
  }
}
