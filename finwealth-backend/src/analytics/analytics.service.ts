import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async getNetWorth(ledgerId: string, date?: Date) {
    return this.analyticsRepository.getNetWorth(ledgerId, date);
  }

  async getCashFlow(ledgerId: string, startDate: Date, endDate: Date) {
    return this.analyticsRepository.getCashFlow(ledgerId, startDate, endDate);
  }

  async detectAnomalies(ledgerId: string) {
    const historicalData =
      await this.analyticsRepository.getHistoricalAggregates(ledgerId, 7);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Agrupar por cuenta
    const accountMap = new Map<
      string,
      {
        name: string;
        currentTotal: number;
        historicalTotals: number[];
      }
    >();

    for (const entry of historicalData) {
      if (!accountMap.has(entry.accountId)) {
        accountMap.set(entry.accountId, {
          name: entry.accountName,
          currentTotal: 0,
          historicalTotals: [],
        });
      }

      const account = accountMap.get(entry.accountId)!;
      const amount = parseFloat(entry.totalAmount);

      if (entry.month === currentMonth && entry.year === currentYear) {
        account.currentTotal = amount;
      } else {
        account.historicalTotals.push(amount);
      }
    }

    const anomalies: {
      type: 'spike';
      accountName: string;
      amountCurrent: number;
      amountAverage: number;
      diffPercentage: number;
    }[] = [];

    for (const data of accountMap.values()) {
      if (data.historicalTotals.length === 0) continue;

      const sum = data.historicalTotals.reduce((a, b) => a + b, 0);
      const average = sum / data.historicalTotals.length;

      if (average === 0) {
        if (data.currentTotal > 0) {
          anomalies.push({
            type: 'spike',
            accountName: data.name,
            amountCurrent: data.currentTotal,
            amountAverage: 0,
            diffPercentage: 100, // Incremento inusual desde 0
          });
        }
        continue;
      }

      // Cálculo de Desviación Estándar
      const squareDiffs = data.historicalTotals.map((val) => {
        const diff = val - average;
        return diff * diff;
      });
      const avgSquareDiff =
        squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
      const stdDev = Math.sqrt(avgSquareDiff);

      const diffPercentage = ((data.currentTotal - average) / average) * 100;

      // Criterios: > 1.5 StdDev O > 50% incremento
      const isSpikeByStdDev =
        stdDev > 0 && data.currentTotal > average + 1.5 * stdDev;
      const isSpikeByPercentage = diffPercentage > 50;

      if (isSpikeByStdDev || isSpikeByPercentage) {
        anomalies.push({
          type: 'spike',
          accountName: data.name,
          amountCurrent: Number(data.currentTotal.toFixed(2)),
          amountAverage: Number(average.toFixed(2)),
          diffPercentage: Number(diffPercentage.toFixed(2)),
        });
      }
    }

    return anomalies;
  }
}
