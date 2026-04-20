import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsRepository } from './transactions.repository';
import { DoubleEntryService } from '../cpa-engine/double-entry.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly repository: TransactionsRepository,
    private readonly doubleEntryService: DoubleEntryService,
  ) {}

  /**
   * Processes a transaction request, ensuring double-entry constraints.
   */
  async createTransaction(
    createDto: CreateTransactionDto,
    _userId: string,
  ): Promise<{ id: string }> {
    // 1. Math constraint: ensure balance is zero before DB touch
    this.doubleEntryService.validateTransactionBalance(
      createDto.entries.map((entry) => ({
        accountId: entry.accountId,
        amount: entry.amount,
      })),
    );

    // 2. Acknowledge userId for future ledger validation
    void _userId;

    // 3. Delegate to repository
    const id = await this.repository.createWithEntries(createDto);

    return { id };
  }
}
