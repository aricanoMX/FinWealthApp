import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../core/database/database.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'finwealth-infra/src/schema';
import { eq, and, lte, sql, inArray, SQL } from 'drizzle-orm';

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
}
