import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVillageDto, UpdateVillageDto } from './dto';

@Injectable()
export class VillagesService {
  constructor(private prisma: PrismaService) {}

  findAll(query?: string) {
    return this.prisma.village.findMany({
      where: {
        deletedAt: null,
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { district: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const village = await this.prisma.village.findFirst({ where: { id, deletedAt: null } });
    if (!village) throw new NotFoundException('Village not found');
    return village;
  }

  create(dto: CreateVillageDto) {
    return this.prisma.village.create({ data: { ...dto, active: true } });
  }

  async update(id: string, dto: UpdateVillageDto) {
    await this.findOne(id);
    return this.prisma.village.update({ where: { id }, data: dto });
  }

  async toggleActive(id: string) {
    const village = await this.findOne(id);
    return this.prisma.village.update({ where: { id }, data: { active: !village.active } });
  }
}
