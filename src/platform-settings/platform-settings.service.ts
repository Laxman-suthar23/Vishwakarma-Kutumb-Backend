import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePlatformSettingsDto } from './dto';

@Injectable()
export class PlatformSettingsService {
  constructor(private prisma: PrismaService) {}

  async find() {
    return this.prisma.platformSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  }

  update(dto: UpdatePlatformSettingsDto) {
    return this.prisma.platformSettings.update({ where: { id: 1 }, data: dto });
  }
}
