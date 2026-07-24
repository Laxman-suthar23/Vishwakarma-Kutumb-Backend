import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      where: { role: { in: [UserRole.village_admin, UserRole.super_admin] } },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateAdminDto) {
    return this.prisma.user.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        role: dto.role,
        villageId: dto.role === 'village_admin' ? dto.villageId : undefined,
        active: true,
      },
    });
  }

  async toggleActive(id: string) {
    const admin = await this.prisma.user.findUniqueOrThrow({ where: { id } });
    return this.prisma.user.update({ where: { id }, data: { active: !admin.active } });
  }
}
