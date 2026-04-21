/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsService } from './budgets.service';
import { BudgetsRepository } from './budgets.repository';
import { DATABASE_CONNECTION } from '../core/database/database.module';
import { ForbiddenException } from '@nestjs/common';

describe('BudgetsService', () => {
  let service: BudgetsService;
  let repository: jest.Mocked<BudgetsRepository>;
  let db: {
    query: {
      ledgers: {
        findFirst: jest.Mock;
      };
    };
  };

  beforeEach(async () => {
    const mockRepository = {
      createBudget: jest.fn(),
      getBudgetPerformance: jest.fn(),
    };

    const mockDb = {
      query: {
        ledgers: {
          findFirst: jest.fn(),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetsService,
        { provide: BudgetsRepository, useValue: mockRepository },
        { provide: DATABASE_CONNECTION, useValue: mockDb },
      ],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
    repository = module.get<BudgetsRepository>(
      BudgetsRepository,
    ) as jest.Mocked<BudgetsRepository>;
    db = module.get(DATABASE_CONNECTION);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBudget', () => {
    it('should throw ForbiddenException if ledger does not belong to user', async () => {
      db.query.ledgers.findFirst.mockResolvedValue(null);

      await expect(
        service.createBudget('user-1', {
          ledgerId: 'ledger-1',
          amountLimit: 100,
          periodMonth: 1,
          periodYear: 2024,
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should call repository if ledger belongs to user', async () => {
      db.query.ledgers.findFirst.mockResolvedValue({ id: 'ledger-1' });
      const budgetData = {
        ledgerId: 'ledger-1',
        amountLimit: 100,
        periodMonth: 1,
        periodYear: 2024,
      };

      await service.createBudget('user-1', budgetData);

      expect(repository.createBudget).toHaveBeenCalledWith(budgetData);
    });
  });
});
