import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { AnalyticsRepository } from './analytics.repository';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockAnalyticsRepository = {
    getHistoricalAggregates: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: AnalyticsRepository,
          useValue: mockAnalyticsRepository,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('detectAnomalies', () => {
    it('should detect a spike if current spending is > 50% above average', async () => {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const historicalData = [
        {
          accountId: '1',
          accountName: 'Food',
          month: 1,
          year: 2024,
          totalAmount: '100',
        },
        {
          accountId: '1',
          accountName: 'Food',
          month: 2,
          year: 2024,
          totalAmount: '100',
        },
        {
          accountId: '1',
          accountName: 'Food',
          month: currentMonth,
          year: currentYear,
          totalAmount: '200',
        },
      ];

      mockAnalyticsRepository.getHistoricalAggregates.mockResolvedValue(
        historicalData,
      );

      const result = await service.detectAnomalies('ledger-id');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        type: 'spike',
        accountName: 'Food',
        amountCurrent: 200,
        amountAverage: 100,
        diffPercentage: 100,
      });
    });

    it('should detect a spike if current spending is > 1.5 standard deviations', async () => {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      // Baseline: 100, 105, 95, 100, 100, 100 (Avg: 100, Low StdDev)
      // Current: 150 (50% increase AND likely > 1.5 StdDev)
      const historicalData = [
        {
          accountId: '1',
          accountName: 'Rent',
          month: 1,
          year: 2024,
          totalAmount: '100',
        },
        {
          accountId: '1',
          accountName: 'Rent',
          month: 2,
          year: 2024,
          totalAmount: '100',
        },
        {
          accountId: '1',
          accountName: 'Rent',
          month: 3,
          year: 2024,
          totalAmount: '100',
        },
        {
          accountId: '1',
          accountName: 'Rent',
          month: currentMonth,
          year: currentYear,
          totalAmount: '160',
        },
      ];

      mockAnalyticsRepository.getHistoricalAggregates.mockResolvedValue(
        historicalData,
      );

      const result = await service.detectAnomalies('ledger-id');

      expect(result).toHaveLength(1);
      expect(result[0].accountName).toBe('Rent');
      expect(result[0].amountCurrent).toBe(160);
    });

    it('should not detect an anomaly if spending is within normal range', async () => {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const historicalData = [
        {
          accountId: '1',
          accountName: 'Food',
          month: 1,
          year: 2024,
          totalAmount: '100',
        },
        {
          accountId: '1',
          accountName: 'Food',
          month: currentMonth,
          year: currentYear,
          totalAmount: '110',
        },
      ];

      mockAnalyticsRepository.getHistoricalAggregates.mockResolvedValue(
        historicalData,
      );

      const result = await service.detectAnomalies('ledger-id');

      expect(result).toHaveLength(0);
    });
  });
});
