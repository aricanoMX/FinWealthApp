import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';

describe('BudgetsController', () => {
  let controller: BudgetsController;
  let service: BudgetsService;

  beforeEach(async () => {
    const mockService = {
      createBudget: jest.fn(),
      getBudgetPerformance: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetsController],
      providers: [{ provide: BudgetsService, useValue: mockService }],
    }).compile();

    controller = module.get<BudgetsController>(BudgetsController);
    service = module.get<BudgetsService>(BudgetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBudget', () => {
    it('should call service.createBudget', async () => {
      const user = { userId: 'user-1', email: 'test@example.com' };
      const dto = {
        ledgerId: 'ledger-1',
        amountLimit: 100,
        periodMonth: 1,
        periodYear: 2024,
      };

      await controller.createBudget(user, dto);

      expect(service.createBudget).toHaveBeenCalledWith(user.userId, dto);
    });
  });

  describe('getPerformance', () => {
    it('should call service.getBudgetPerformance', async () => {
      const user = { userId: 'user-1', email: 'test@example.com' };
      const ledgerId = 'ledger-1';
      const month = '1';
      const year = '2024';

      await controller.getPerformance(user, ledgerId, month, year);

      expect(service.getBudgetPerformance).toHaveBeenCalledWith(
        user.userId,
        ledgerId,
        1,
        2024,
      );
    });
  });
});
