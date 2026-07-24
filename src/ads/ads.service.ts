import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AdStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdDto, UpdateAdStatusDto } from './dto';

@Injectable()
export class AdsService {
  private readonly logger = new Logger(AdsService.name);

  constructor(private prisma: PrismaService) {}

  findAll(params: { villageId?: string; status?: AdStatus }) {
    return this.prisma.advertisement.findMany({
      where: {
        ...(params.villageId ? { villageId: params.villageId } : {}),
        ...(params.status ? { status: params.status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateAdDto) {
    return this.prisma.advertisement.create({
      data: { ...dto, status: 'pending_payment' },
    });
  }

  async updateStatus(id: string, dto: UpdateAdStatusDto) {
    const ad = await this.prisma.advertisement.findUnique({ where: { id } });
    if (!ad) throw new NotFoundException('Advertisement not found');

    const data: { status: AdStatus; startDate?: Date; endDate?: Date } = { status: dto.status };

    // Approving an ad (-> scheduled) stamps its live window using the
    // product's configured duration, so the scheduler below knows when to
    // flip it live and later expire it.
    if (dto.status === 'scheduled' && !ad.startDate) {
      const pricing = await this.prisma.adPricing.findUnique({ where: { product: ad.product } });
      const durationDays = pricing?.durationDays ?? 30;
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
      data.startDate = startDate;
      data.endDate = endDate;
    }

    return this.prisma.advertisement.update({ where: { id }, data });
  }

  /**
   * Publish/expire pass. Real "Schedule -> Publish" step from the bible's
   * ad workflow: called on a cron by AdsSchedulerService, not by clients.
   */
  async runScheduledTransitions() {
    const now = new Date();

    const toPublish = await this.prisma.advertisement.updateMany({
      where: { status: 'scheduled', startDate: { lte: now } },
      data: { status: 'live' },
    });
    const toExpire = await this.prisma.advertisement.updateMany({
      where: { status: 'live', endDate: { lte: now } },
      data: { status: 'expired' },
    });

    if (toPublish.count || toExpire.count) {
      this.logger.log(`Ad scheduler: published ${toPublish.count}, expired ${toExpire.count}`);
    }
    return { published: toPublish.count, expired: toExpire.count };
  }
}
