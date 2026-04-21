/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: jest.Mocked<TransactionsService>;

  beforeEach(async () => {
    const mockService = {
      createTransaction: jest.fn(),
      getAccountSuggestions: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [{ provide: TransactionsService, useValue: mockService }],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSuggestions', () => {
    it('should return suggestions from the service', async () => {
      const suggestions = [{ accountId: 'acc-1', name: 'Food', count: 10 }];
      const user = { userId: 'user-123', email: 'test@test.com' };
      const ledgerId = 'ledger-1';

      service.getAccountSuggestions.mockResolvedValue(suggestions);

      const result = await controller.getSuggestions(ledgerId, user);

      expect(service.getAccountSuggestions).toHaveBeenCalledWith(
        ledgerId,
        user.userId,
      );
      expect(result).toEqual({
        success: true,
        data: suggestions,
      });
    });
  });

  describe('create', () => {
    it('should return a success response with the created ID', async () => {
      const createDto: CreateTransactionDto = {
        ledgerId: 'ledger-1',
        date: '2023-10-01T00:00:00Z',
        description: 'Test transaction',
        entries: [],
      };
      const user = { userId: 'user-123', email: 'test@test.com' };

      service.createTransaction.mockResolvedValue({ id: 'trans-id-123' });

      const result = await controller.create(createDto, user);

      expect(service.createTransaction).toHaveBeenCalledWith(
        createDto,
        user.userId,
      );
      expect(result).toEqual({
        success: true,
        data: { id: 'trans-id-123' },
      });
    });
  });
});
