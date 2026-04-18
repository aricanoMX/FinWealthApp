import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../core/database/database.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'finwealth-infra/src/schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  /**
   * Persists a transaction and its journal entries atomically.
   */
  async createWithEntries(data: CreateTransactionDto): Promise<string> {
    return this.db.transaction(async (tx) => {
      // 1. Insert Transaction
      const [insertedTransaction] = await tx
        .insert(schema.transactions)
        .values({
          ledgerId: data.ledgerId,
          date: new Date(data.date),
          description: data.description,
          rawData: data.rawData,
          receiptUrl: data.receiptUrl,
        })
        .returning({ id: schema.transactions.id });

      const transactionId = insertedTransaction.id;

      // 2. Insert Journal Entries
      const entriesToInsert = data.entries.map((entry) => ({
        transactionId,
        accountId: entry.accountId,
        amount: entry.amount,
        isDeductible: entry.isDeductible ?? false,
        taxAmount: entry.taxAmount,
      }));

      await tx.insert(schema.journalEntries).values(entriesToInsert);

      return transactionId;
    });
  }
}
