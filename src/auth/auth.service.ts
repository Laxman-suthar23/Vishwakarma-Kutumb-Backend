import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { OtpProviderService } from './otp-provider.service';

const OTP_TTL_MINUTES = 5;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private otpProvider: OtpProviderService,
  ) {}

  async requestOtp(phone: string) {
    const settings = await this.prisma.platformSettings.findUnique({ where: { id: 1 } });
    if (settings?.maintenanceMode) {
      throw new BadRequestException('The app is temporarily under maintenance. Please try again later.');
    }

    // Demo-friendly fixed code, overridable via OTP_MOCK_CODE. A real SMS
    // gateway integration would generate a random code here instead.
    const code = this.config.get<string>('OTP_MOCK_CODE', '123456');
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await this.prisma.otpCode.create({ data: { phone, code, expiresAt } });
    await this.otpProvider.send(phone, code);

    return { success: true as const };
  }

  async verifyOtp(phone: string, otp: string, demoRole?: 'member' | 'village_admin' | 'super_admin') {
    const record = await this.prisma.otpCode.findFirst({
      where: { phone, code: otp, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new UnauthorizedException('Invalid or expired OTP. Please try again.');
    }

    await this.prisma.otpCode.update({ where: { id: record.id }, data: { consumedAt: new Date() } });

    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      const settings = await this.prisma.platformSettings.findUnique({ where: { id: 1 } });
      if (settings && !settings.newRegistrationsEnabled) {
        throw new BadRequestException('New registrations are currently disabled.');
      }
      user = await this.prisma.user.create({
        data: {
          phone,
          name: `Member ${phone.slice(-4)}`,
          // `demoRole` exists purely so the still-mock-auth RN client can
          // preview all three role experiences before real role assignment
          // (invites, village-admin promotion flows, etc.) is built. Remove
          // this parameter once that exists — new sign-ups should always
          // default to `member` in production.
          role: demoRole ?? 'member',
        },
      });
    }

    if (!user.active) {
      throw new UnauthorizedException('This account has been deactivated. Contact your village admin.');
    }

    const token = this.jwt.sign({ sub: user.id, phone: user.phone, role: user.role });

    await this.prisma.auditLog.create({
      data: { userId: user.id, action: 'login', entity: 'User', entityId: user.id },
    });

    return {
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        villageId: user.villageId ?? undefined,
        familyId: user.familyId ?? undefined,
      },
      token,
    };
  }
}
