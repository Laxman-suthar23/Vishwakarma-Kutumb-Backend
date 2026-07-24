import { Module } from '@nestjs/common';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { AdsSchedulerService } from './ads-scheduler.service';

@Module({
  controllers: [AdsController],
  providers: [AdsService, AdsSchedulerService],
})
export class AdsModule {}
