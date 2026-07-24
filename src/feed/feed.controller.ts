import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FeedService } from './feed.service';

@UseGuards(JwtAuthGuard)
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
}
