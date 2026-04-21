import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async getNetWorth(ledgerId: string, date?: Date) {
    return this.analyticsRepository.getNetWorth(ledgerId, date);
  }
}
