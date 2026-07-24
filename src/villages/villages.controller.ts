import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { VillagesService } from './villages.service';
import { CreateVillageDto, UpdateVillageDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('villages')
export class VillagesController {
  constructor(private villagesService: VillagesService) {}

  @Get()
  findAll(@Query('query') query?: string) {
    return this.villagesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.villagesService.findOne(id);
  }

  @Roles(UserRole.super_admin)
  @Post()
  create(@Body() dto: CreateVillageDto) {
    return this.villagesService.create(dto);
  }

  @Roles(UserRole.super_admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVillageDto) {
    return this.villagesService.update(id, dto);
  }

  @Roles(UserRole.super_admin)
  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string) {
    return this.villagesService.toggleActive(id);
  }
}
