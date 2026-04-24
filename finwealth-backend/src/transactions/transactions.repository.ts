import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../core/database/database.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'finwealth-infra/src/schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { eq, sql, desc, and, gte, lte, inArray } from 'drizzle-orm';

@Injectable()
export class TransactionsRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  /**
   * Verifies if a transaction belongs to a given user.
   */
  async verifyTransactionOwnership(
    transactionId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await this.db
      .select({ id: schema.transactions.id })
      .from(schema.transactions)
      .innerJoin(
        schema.ledgers,
        eq(schema.ledgers.id, schema.transactions.ledgerId),
      )
      .where(
        and(
          eq(schema.transactions.id, transactionId),
          eq(schema.ledgers.userId, userId),
        ),
      )
      .limit(1);

    return result.length > 0;
  }

  /**
   * Updates a transaction and its journal entries atomically.
   */
  async updateTransaction(
    id: string,
    data: UpdateTransactionDto,
  ): Promise<string> {
    return this.db.transaction(async (tx) => {
      // 1. Update Transaction (if fields are provided)
      type TransactionUpdate = Partial<{
        ledgerId: string;
        date: Date;
        description: string;
        rawData: unknown;
        receiptUrl: string;
      }>;
      const updateData: TransactionUpdate = {};
      if (data.ledgerId !== undefined) updateData.ledgerId = data.ledgerId;
      if (data.date !== undefined) updateData.date = new Date(data.date);
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.rawData !== undefined)
        updateData.rawData = data.rawData as unknown;
      if (data.receiptUrl !== undefined)
        updateData.receiptUrl = data.receiptUrl;

      if (Object.keys(updateData).length > 0) {
        await tx
          .update(schema.transactions)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(schema.transactions.id, id));
      }

      // 2. Update Journal Entries (if provided)
      if (data.entries) {
        // Delete old entries
        await tx
          .delete(schema.journalEntries)
          .where(eq(schema.journalEntries.transactionId, id));

        // Insert new entries
        const entriesToInsert = data.entries.map((entry) => ({
          transactionId: id,
          accountId: entry.accountId,
          amount: entry.amount,
          isDeductible: entry.isDeductible ?? false,
          taxAmount: entry.taxAmount,
        }));

        await tx.insert(schema.journalEntries).values(entriesToInsert);
      }

      return id;
    });
  }

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
   * Counts total transactions matching filters.
   */
  async countTransactions(
    ledgerId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const filters = [eq(schema.transactions.ledgerId, ledgerId)];
    if (startDate) filters.push(gte(schema.transactions.date, startDate));
    if (endDate) filters.push(lte(schema.transactions.date, endDate));

    const [result] = await this.db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(schema.transactions)
      .where(and(...filters));

    return result.count;
  }

  /**
   * Fetches paginated transactions with nested journal entries.
   */
  async getTransactions(
    ledgerId: string,
    limit: number,
    offset: number,
    startDate?: Date,
    endDate?: Date,
  ) {
    const filters = [eq(schema.transactions.ledgerId, ledgerId)];
    if (startDate) filters.push(gte(schema.transactions.date, startDate));
    if (endDate) filters.push(lte(schema.transactions.date, endDate));

    const txs = await this.db
      .select()
      .from(schema.transactions)
      .where(and(...filters))
      .orderBy(
        desc(schema.transactions.date),
        desc(schema.transactions.createdAt),
      )
      .limit(limit)
      .offset(offset);

    if (txs.length === 0) return [];

    const txIds = txs.map((t) => t.id);

    const entries = await this.db
      .select()
      .from(schema.journalEntries)
      .where(inArray(schema.journalEntries.transactionId, txIds));

    return txs.map((tx) => ({
      ...tx,
      entries: entries.filter((e) => e.transactionId === tx.id),
    }));
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
