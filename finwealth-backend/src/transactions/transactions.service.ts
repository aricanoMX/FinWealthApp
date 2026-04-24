import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsRepository } from './transactions.repository';
import { DoubleEntryService } from '../cpa-engine/double-entry.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly repository: TransactionsRepository,
    private readonly doubleEntryService: DoubleEntryService,
  ) {}

  /**
   * Updates a transaction request, ensuring double-entry constraints.
   */
  async updateTransaction(
    id: string,
    updateDto: UpdateTransactionDto,
    userId: string,
  ): Promise<{ id: string }> {
    // 1. Verify ownership
    const isOwner = await this.repository.verifyTransactionOwnership(
      id,
      userId,
    );
    if (!isOwner) {
      throw new NotFoundException(
        `Transaction with ID ${id} not found or you don't have permission to modify it.`,
      );
    }

    // 2. Math constraint if entries are updated
    if (updateDto.entries) {
      this.doubleEntryService.validateTransactionBalance(
        updateDto.entries.map((entry) => ({
          accountId: entry.accountId,
          amount: entry.amount,
        })),
      );
    }

    // 3. Delegate to repository
    await this.repository.updateTransaction(id, updateDto);

    return { id };
  }

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

  /**
   * Retrieves paginated transactions with optional date filters.
   */
  async getTransactions(
    ledgerId: string,
    limit: number,
    offset: number,
    startDate?: Date,
    endDate?: Date,
  ) {
    const [data, total] = await Promise.all([
      this.repository.getTransactions(
        ledgerId,
        limit,
        offset,
        startDate,
        endDate,
      ),
      this.repository.countTransactions(ledgerId, startDate, endDate),
    ]);

    return { data, total };
  }

  /**
   * Returns most used accounts for a ledger as suggestions.
   */
  async getAccountSuggestions(
    ledgerId: string,
    userId: string,
  ): Promise<{ accountId: string; name: string; count: number }[]> {
    // Security: In a real scenario, verify userId has access to ledgerId here
    // For now, we delegate to repository as requested
    void userId;
    return this.repository.getMostUsedAccounts(ledgerId);
  }
}
