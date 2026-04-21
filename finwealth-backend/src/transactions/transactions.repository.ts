import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../core/database/database.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'finwealth-infra/src/schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { eq, sql, desc } from 'drizzle-orm';

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

  /**
   * Fetches the most used accounts for a given ledger.
   */
  async getMostUsedAccounts(
    ledgerId: string,
    limit: number = 5,
  ): Promise<{ accountId: string; name: string; count: number }[]> {
    const results = (await this.db
      .select({
        accountId: schema.journalEntries.accountId,
        name: schema.accounts.name,
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(schema.journalEntries)
      .innerJoin(
        schema.transactions,
        eq(schema.transactions.id, schema.journalEntries.transactionId),
      )
      .innerJoin(
        schema.accounts,
        eq(schema.accounts.id, schema.journalEntries.accountId),
      )
      .where(eq(schema.transactions.ledgerId, ledgerId))
      .groupBy(schema.journalEntries.accountId, schema.accounts.name)
      .orderBy(desc(sql`count(*)`))
      .limit(limit)) as { accountId: string; name: string; count: number }[];

    return results;
  }
}
