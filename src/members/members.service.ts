import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto, UpdateMemberDto } from './dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  findByFamily(familyId: string) {
    return this.prisma.member.findMany({ where: { familyId, deletedAt: null }, orderBy: { createdAt: 'asc' } });
  }

  findByVillage(villageId: string, query?: string) {
    return this.prisma.member.findMany({
      where: {
        villageId,
        deletedAt: null,
        ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.member.findFirst({ where: { id, deletedAt: null } });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async create(dto: CreateMemberDto) {
    const member = await this.prisma.member.create({ data: dto });
    await this.prisma.village.update({
      where: { id: dto.villageId },
      data: { memberCount: { increment: 1 } },
    });
    return member;
  }

  async update(id: string, dto: UpdateMemberDto) {
    await this.findOne(id);
    return this.prisma.member.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const member = await this.findOne(id);
    await this.prisma.member.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.prisma.village.update({
      where: { id: member.villageId },
      data: { memberCount: { decrement: 1 } },
    });
  }

  async setFamilyHead(familyId: string, memberId: string) {
    await this.prisma.member.updateMany({ where: { familyId }, data: { isFamilyHead: false } });
    await this.prisma.member.update({ where: { id: memberId }, data: { isFamilyHead: true } });
    await this.prisma.family.update({ where: { id: familyId }, data: { headMemberId: memberId } });
  }
}
