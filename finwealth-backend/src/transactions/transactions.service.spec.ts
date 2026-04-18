/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { DoubleEntryService } from '../cpa-engine/double-entry.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { DoubleEntryViolationException } from '../cpa-engine/exceptions/double-entry-violation.exception';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: jest.Mocked<TransactionsRepository>;
  let doubleEntryService: jest.Mocked<DoubleEntryService>;

  beforeEach(async () => {
    const mockRepository = {
      createWithEntries: jest.fn(),
    };

    const mockDoubleEntryService = {
      validateTransactionBalance: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: TransactionsRepository, useValue: mockRepository },
        { provide: DoubleEntryService, useValue: mockDoubleEntryService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get(TransactionsRepository);
    doubleEntryService = module.get(DoubleEntryService);
  });

  it('should process a valid transaction', async () => {
    const createDto: CreateTransactionDto = {
      ledgerId: 'ledger-1',
      date: '2023-10-01T00:00:00Z',
      description: 'Test transaction',
      entries: [
        { accountId: 'acc-1', amount: '100.00' },
        { accountId: 'acc-2', amount: '-100.00' },
      ],
    };

    doubleEntryService.validateTransactionBalance.mockReturnValue(true);
    repository.createWithEntries.mockResolvedValue('transaction-id-123');

    const result = await service.createTransaction(createDto);

    expect(doubleEntryService.validateTransactionBalance).toHaveBeenCalledWith([
      { accountId: 'acc-1', amount: '100.00' },
      { accountId: 'acc-2', amount: '-100.00' },
    ]);
    expect(repository.createWithEntries).toHaveBeenCalledWith(createDto);
    expect(result).toEqual({ id: 'transaction-id-123' });
  });

  it('should throw DoubleEntryViolationException if math validation fails', async () => {
    const createDto: CreateTransactionDto = {
      ledgerId: 'ledger-1',
      date: '2023-10-01T00:00:00Z',
      description: 'Test transaction',
      entries: [
        { accountId: 'acc-1', amount: '100.00' },
        { accountId: 'acc-2', amount: '-50.00' },
      ],
    };

    doubleEntryService.validateTransactionBalance.mockImplementation(() => {
      throw new DoubleEntryViolationException();
    });

    await expect(service.createTransaction(createDto)).rejects.toThrow(
      DoubleEntryViolationException,
    );
    expect(repository.createWithEntries).not.toHaveBeenCalled();
  });
});
