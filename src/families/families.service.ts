import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFamilyDto, UpdateFamilyDto } from './dto';

@Injectable()
export class FamiliesService {
  constructor(private prisma: PrismaService) {}

  async findByVillage(villageId: string, query?: string) {
    const families = await this.prisma.family.findMany({
      where: {
        villageId,
        deletedAt: null,
        ...(query ? { headName: { contains: query, mode: 'insensitive' } } : {}),
      },
      include: { 
        _count: { select: { members: { where: { deletedAt: null } } } },
        members: { where: { isFamilyHead: true }, select: { phone: true } }
      },
      orderBy: { headName: 'asc' },
    });
    
    return families.map(f => {
      const { _count, members, ...rest } = f;
      return { 
        ...rest, 
        memberCount: _count.members,
        headPhone: rest.headPhone || (members && members[0]?.phone) || null 
      };
    });
  }

  async findOne(id: string) {
    const family = await this.prisma.family.findFirst({
      where: { id, deletedAt: null },
      include: { 
        _count: { select: { members: { where: { deletedAt: null } } } },
        members: { where: { isFamilyHead: true }, select: { phone: true } }
      },
    });
    if (!family) throw new NotFoundException('Family not found');
    const { _count, members, ...rest } = family;
    return { 
      ...rest, 
      memberCount: _count.members,
      headPhone: rest.headPhone || (members && members[0]?.phone) || null
    };
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
    
    // Soft delete all members associated with this family
    await this.prisma.member.updateMany({
      where: { familyId: id, deletedAt: null },
      data: { deletedAt: new Date() }
    });

    await this.prisma.village.update({
      where: { id: family.villageId },
      data: {
        familyCount: { decrement: 1 },
        memberCount: { decrement: family.memberCount },
      },
    });
  }

  async update(id: string, dto: UpdateFamilyDto) {
    return this.prisma.family.update({ where: { id }, data: dto });
  }
}
