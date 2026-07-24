import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdStatus, UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdsService } from './ads.service';
import { CreateAdDto, UpdateAdStatusDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ads')
export class AdsController {
  constructor(private adsService: AdsService) {}

  @Get()
  findAll(@Query('villageId') villageId?: string, @Query('status') status?: AdStatus) {
    return this.adsService.findAll({ villageId, status });
  }

  @Post()
  create(@Body() dto: CreateAdDto) {
    return this.adsService.create(dto);
  }

  @Roles(UserRole.village_admin, UserRole.super_admin)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAdStatusDto) {
    return this.adsService.updateStatus(id, dto);
  }
}
