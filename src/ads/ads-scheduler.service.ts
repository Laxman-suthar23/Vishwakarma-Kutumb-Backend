import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AdsService } from './ads.service';

/**
 * Real implementation of the roadmap's "scheduler to flip scheduled -> live
 * -> expired ads automatically". Runs every 15 minutes; adjust the cron
 * expression if ads need to go live at a more precise time.
 */
@Injectable()
export class AdsSchedulerService {
  private readonly logger = new Logger(AdsSchedulerService.name);

  constructor(private adsService: AdsService) {}

  @Cron('*/15 * * * *')
  async handleCron() {
    await this.adsService.runScheduledTransitions();
  }
}
