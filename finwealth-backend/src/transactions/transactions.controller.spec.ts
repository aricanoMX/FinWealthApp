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

  describe('create', () => {
    it('should return a success response with the created ID', async () => {
      const createDto: CreateTransactionDto = {
        ledgerId: 'ledger-1',
        date: '2023-10-01T00:00:00Z',
        description: 'Test transaction',
        entries: [],
      };

      service.createTransaction.mockResolvedValue({ id: 'trans-id-123' });

      const result = await controller.create(createDto);

      expect(service.createTransaction).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({
        success: true,
        data: { id: 'trans-id-123' },
      });
    });
  });
});
