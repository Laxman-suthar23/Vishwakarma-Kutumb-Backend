import { Injectable, Logger } from '@nestjs/common';

/**
 * OTP delivery abstraction. This mock implementation just logs the code —
 * swap it for a real SMS gateway (MSG91, Twilio Verify, etc.) by
 * implementing the same `send()` method and re-providing this token.
 * Nothing else in AuthService needs to change.
 */
@Injectable()
export class OtpProviderService {
  private readonly logger = new Logger(OtpProviderService.name);

  async send(phone: string, code: string): Promise<void> {
    this.logger.log(`[MOCK SMS] OTP for +91${phone}: ${code}`);
  }
}
