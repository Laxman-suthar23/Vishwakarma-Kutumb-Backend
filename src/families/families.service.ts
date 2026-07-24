import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFamilyDto } from './dto';

@Injectable()
export class FamiliesService {
  constructor(private prisma: PrismaService) {}

  async findByVillage(villageId: string, query?: string) {
    return this.prisma.family.findMany({
      where: {
        villageId,
        deletedAt: null,
        ...(query ? { surname: { contains: query, mode: 'insensitive' } } : {}),
      },
      include: { _count: { select: { members: true } } },
      orderBy: { surname: 'asc' },
    });
  }

  async findOne(id: string) {
    const family = await this.prisma.family.findFirst({
      where: { id, deletedAt: null },
      include: { _count: { select: { members: true } } },
    });
    if (!family) throw new NotFoundException('Family not found');
    return family;
  }

  async create(dto: CreateFamilyDto) {
    const family = await this.prisma.family.create({ data: dto });
    await this.prisma.village.update({
      where: { id: dto.villageId },
      data: { familyCount: { increment: 1 } },
    });
    return family;
  }

  async remove(id: string) {
    const family = await this.findOne(id);
    await this.prisma.family.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.prisma.village.update({
      where: { id: family.villageId },
      data: {
        familyCount: { decrement: 1 },
        memberCount: { decrement: family._count.members },
      },
    });
  }
}
