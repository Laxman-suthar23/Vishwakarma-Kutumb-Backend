import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type FeedPostWithLikes = Prisma.FeedPostGetPayload<{ include: { likes: true } }>;

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser(userId: string) {
    const posts = await this.prisma.feedPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { likes: { where: { userId } } },
    });
    return posts.map((p: FeedPostWithLikes) => ({ ...p, liked: p.likes.length > 0, likes: undefined }));
  }

  async toggleLike(postId: string, userId: string) {
    const existing = await this.prisma.feedLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      await this.prisma.feedLike.delete({ where: { id: existing.id } });
      return this.prisma.feedPost.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      });
    }

    await this.prisma.feedLike.create({ data: { postId, userId } });
    return this.prisma.feedPost.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    });
  }
}
