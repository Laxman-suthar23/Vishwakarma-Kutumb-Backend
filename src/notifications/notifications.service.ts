import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';

type NotificationWithReads = Prisma.NotificationGetPayload<{ include: { reads: true } }>;

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      include: { reads: { where: { userId } } },
    });
    return notifications.map((n: NotificationWithReads) => ({
      id: n.id,
      category: n.category,
      title: n.title,
      body: n.body,
      villageId: n.villageId ?? undefined,
      priority: n.priority,
      createdAt: n.createdAt,
      read: n.reads.length > 0,
    }));
  }

  create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: dto });
  }

  async markRead(id: string, userId: string) {
    await this.prisma.notificationRead.upsert({
      where: { notificationId_userId: { notificationId: id, userId } },
      update: {},
      create: { notificationId: id, userId },
    });
  }

  update(id: string, dto: UpdateNotificationDto) {
    return this.prisma.notification.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }
}
