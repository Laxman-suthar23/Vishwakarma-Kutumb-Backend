import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { VillagesModule } from './villages/villages.module';
import { FamiliesModule } from './families/families.module';
import { MembersModule } from './members/members.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FeedModule } from './feed/feed.module';
import { AdsModule } from './ads/ads.module';
import { AdminsModule } from './admins/admins.module';
import { PaymentsModule } from './payments/payments.module';
import { PricingModule } from './pricing/pricing.module';
import { PlatformSettingsModule } from './platform-settings/platform-settings.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    VillagesModule,
    FamiliesModule,
    MembersModule,
    NotificationsModule,
    FeedModule,
    AdsModule,
    AdminsModule,
    PaymentsModule,
    PricingModule,
    PlatformSettingsModule,
    SearchModule,
  ],
  providers: [
    // Basic rate limiting per PRODUCT_BIBLE.md §15 Performance / §14 Security
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
