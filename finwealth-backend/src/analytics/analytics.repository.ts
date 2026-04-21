import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../core/database/database.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'finwealth-infra/src/schema';
import { eq, and, lte, gte, sql, inArray, SQL } from 'drizzle-orm';
import Decimal from 'decimal.js';

@Injectable()
export class AnalyticsRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async getNetWorth(ledgerId: string, date?: Date) {
    const filters: (SQL | undefined)[] = [
      eq(schema.transactions.ledgerId, ledgerId),
    ];

    if (date) {
      filters.push(lte(schema.transactions.date, date));
    }

    // Filtramos solo cuentas de tipo 'asset' o 'liability'
    filters.push(inArray(schema.accounts.type, ['asset', 'liability']));

    const result = await this.db
      .select({
        assets: sql<string>`COALESCE(SUM(CASE WHEN ${schema.accounts.type} = 'asset' THEN ${schema.journalEntries.amount} ELSE 0 END), 0)::TEXT`,
        liabilities: sql<string>`COALESCE(SUM(CASE WHEN ${schema.accounts.type} = 'liability' THEN ${schema.journalEntries.amount} ELSE 0 END), 0)::TEXT`,
        netWorth: sql<string>`COALESCE(SUM(${schema.journalEntries.amount}), 0)::TEXT`,
      })
      .from(schema.journalEntries)
      .innerJoin(
        schema.transactions,
        eq(schema.journalEntries.transactionId, schema.transactions.id),
      )
      .innerJoin(
        schema.accounts,
        eq(schema.journalEntries.accountId, schema.accounts.id),
      )
      .where(and(...filters));

    return result[0];
  }

  async getCashFlow(ledgerId: string, startDate: Date, endDate: Date) {
    const filters: (SQL | undefined)[] = [
      eq(schema.transactions.ledgerId, ledgerId),
      gte(schema.transactions.date, startDate),
      lte(schema.transactions.date, endDate),
    ];

    const result = await this.db
      .select({
        income: sql<string>`COALESCE(SUM(CASE WHEN ${schema.accounts.type} = 'revenue' THEN -${schema.journalEntries.amount} ELSE 0 END), 0)::TEXT`,
        expenses: sql<string>`COALESCE(SUM(CASE WHEN ${schema.accounts.type} = 'expense' THEN ${schema.journalEntries.amount} ELSE 0 END), 0)::TEXT`,
      })
      .from(schema.journalEntries)
      .innerJoin(
        schema.transactions,
        eq(schema.journalEntries.transactionId, schema.transactions.id),
      )
      .innerJoin(
        schema.accounts,
        eq(schema.journalEntries.accountId, schema.accounts.id),
      )
      .where(and(...filters));

    const { income, expenses } = result[0];
    const netCashFlow = new Decimal(income).minus(expenses).toFixed(2);

    return {
      income: new Decimal(income).toFixed(2),
      expenses: new Decimal(expenses).toFixed(2),
      netCashFlow,
    };
  }
}
