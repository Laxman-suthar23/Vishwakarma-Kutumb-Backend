import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(params: { q?: string; gender?: string; maritalStatus?: string; caste?: string; education?: string; occupation?: string; age?: string }) {
    const { gender, maritalStatus, caste, education, occupation, age } = params;
    const q = params.q?.trim();
    if (!q && !gender && !maritalStatus && !caste && !education && !occupation && !age) return [];

    let ageQuery: any = undefined;
    if (age) {
      if (age.includes('-')) {
        const [minStr, maxStr] = age.split('-');
        const min = parseInt(minStr.trim(), 10);
        const max = parseInt(maxStr.trim(), 10);
        if (!isNaN(min) && !isNaN(max)) {
          ageQuery = { gte: min, lte: max };
        }
      } else {
        const exact = parseInt(age.trim(), 10);
        if (!isNaN(exact)) {
          ageQuery = exact;
        }
      }
    }

    const members = await this.prisma.member.findMany({
      where: { 
        deletedAt: null,
        ...(q ? { OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { relation: { contains: q, mode: 'insensitive' } }
        ]} : {}),
        ...(gender ? { gender: gender as any } : {}),
        ...(maritalStatus ? { maritalStatus: maritalStatus as any } : {}),
        ...(caste ? { caste: { contains: caste, mode: 'insensitive' } } : {}),
        ...(education ? { education: { contains: education, mode: 'insensitive' } } : {}),
        ...(occupation ? { occupation: { contains: occupation, mode: 'insensitive' } } : {}),
        ...(ageQuery ? { age: ageQuery } : {}),
      },
      take: 40,
      include: {
        village: {
          select: { name: true }
        }
      }
    });

    return members.map(m => ({ 
      id: m.id, 
      type: 'member', 
      title: m.name, 
      subtitle: m.village?.name || m.relation 
    }));
  }
}
