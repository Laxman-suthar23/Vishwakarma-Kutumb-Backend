import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FeedService } from './feed.service';
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateFeedDto, UpdateFeedDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.feedService.findAllForUser(user.id);
  }

  @Patch(':id/like')
  toggleLike(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.feedService.toggleLike(id, user.id);
  }

  @Roles(UserRole.super_admin)
  @Post()
  create(@Body() dto: CreateFeedDto) {
    return this.feedService.create(dto);
  }

  @Roles(UserRole.super_admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFeedDto) {
    return this.feedService.update(id, dto);
  }

  @Roles(UserRole.super_admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedService.remove(id);
  }
}
