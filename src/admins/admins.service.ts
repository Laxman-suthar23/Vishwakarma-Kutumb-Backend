import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto, UpdateAdminDto } from './dto';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      where: { role: { in: [UserRole.village_admin, UserRole.super_admin] } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateAdminDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          phone: dto.phone,
          email: dto.email,
          password: dto.password,
          role: dto.role,
          villageId: dto.role === 'village_admin' ? dto.villageId : undefined,
          active: true,
        },
      });

      if (user.role === 'village_admin' && user.villageId) {
        await this.prisma.village.update({
          where: { id: user.villageId },
          data: { adminName: user.name },
        });
      }

      return user;
    } catch (error: any) {
      if (error.code === 'P2002') {
        const target = error.meta?.target?.[0] || 'field';
        throw new BadRequestException(`This ${target} is already in use by another user.`);
      }
      throw error;
    }
  }

  async toggleActive(id: string) {
    const admin = await this.prisma.user.findUniqueOrThrow({ where: { id } });
    return this.prisma.user.update({ where: { id }, data: { active: !admin.active } });
  }

  findOne(id: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  async update(id: string, dto: UpdateAdminDto) {
    const data: any = { ...dto };
    if (data.role && data.role !== 'village_admin') {
      data.villageId = null; // Clear village if changing away from village_admin
    }
    
    // Explicitly remove password if it's undefined (just to be absolutely safe with Prisma)
    if (data.password === undefined) {
      delete data.password;
    }

    try {
      const user = await this.prisma.user.update({ where: { id }, data });
      
      // Sync adminName to Village if applicable
      if (user.role === 'village_admin' && user.villageId) {
        await this.prisma.village.update({
          where: { id: user.villageId },
          data: { adminName: user.name },
        });
      }
      
      return user;
    } catch (error: any) {
      if (error.code === 'P2002') {
        const target = error.meta?.target?.[0] || 'field';
        throw new BadRequestException(`This ${target} is already in use by another user.`);
      }
      throw error;
    }
  }
}
