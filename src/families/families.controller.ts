import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FamiliesService } from './families.service';
import { CreateFamilyDto, UpdateFamilyDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('families')
export class FamiliesController {
  constructor(private familiesService: FamiliesService) {}

  @Get()
  findByVillage(@Query('villageId') villageId: string, @Query('query') query?: string) {
    return this.familiesService.findByVillage(villageId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familiesService.findOne(id);
  }

  @Roles(UserRole.village_admin, UserRole.super_admin)
  @Post()
  create(@Body() dto: CreateFamilyDto) {
    return this.familiesService.create(dto);
  }

  @Roles(UserRole.village_admin, UserRole.super_admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.familiesService.remove(id);
  }

  @Roles(UserRole.village_admin, UserRole.super_admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFamilyDto) {
    return this.familiesService.update(id, dto);
  }
}
