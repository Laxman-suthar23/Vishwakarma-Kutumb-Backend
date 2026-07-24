import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { MembersService } from './members.service';
import { CreateMemberDto, UpdateMemberDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get()
  find(@Query('familyId') familyId?: string, @Query('villageId') villageId?: string, @Query('query') query?: string) {
    if (familyId) return this.membersService.findByFamily(familyId);
    return this.membersService.findByVillage(villageId as string, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Roles(UserRole.village_admin, UserRole.super_admin)
  @Post()
  create(@Body() dto: CreateMemberDto) {
    return this.membersService.create(dto);
  }

  @Roles(UserRole.village_admin, UserRole.super_admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.membersService.update(id, dto);
  }

  @Roles(UserRole.village_admin, UserRole.super_admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }

  @Roles(UserRole.village_admin, UserRole.super_admin)
  @Patch(':familyId/set-head/:memberId')
  setHead(@Param('familyId') familyId: string, @Param('memberId') memberId: string) {
    return this.membersService.setFamilyHead(familyId, memberId);
  }
}
