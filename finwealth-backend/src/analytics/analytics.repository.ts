import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../core/database/database.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'finwealth-infra';
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

  async getHistoricalAggregates(ledgerId: string, months: number) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1); // Inicio del mes

    return this.db
      .select({
        accountId: schema.journalEntries.accountId,
        accountName: schema.accounts.name,
        month: sql<number>`EXTRACT(MONTH FROM ${schema.transactions.date})`,
        year: sql<number>`EXTRACT(YEAR FROM ${schema.transactions.date})`,
        totalAmount: sql<string>`SUM(${schema.journalEntries.amount})::TEXT`,
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
      .where(
        and(
          eq(schema.transactions.ledgerId, ledgerId),
          eq(schema.accounts.type, 'expense'),
          gte(schema.transactions.date, startDate),
        ),
      )
      .groupBy(
        schema.journalEntries.accountId,
        schema.accounts.name,
        sql`EXTRACT(MONTH FROM ${schema.transactions.date})`,
        sql`EXTRACT(YEAR FROM ${schema.transactions.date})`,
      );
  }

  async getHistoricalAverage(ledgerId: string, accountId: string) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    startDate.setDate(1);

    const endDate = new Date();
    endDate.setDate(0); // Último día del mes anterior

    const result = await this.db
      .select({
        average: sql<string>`AVG(monthly_total.total)::TEXT`,
        stdDev: sql<string>`STDDEV(monthly_total.total)::TEXT`,
      })
      .from(
        this.db
          .select({
            total: sql<number>`SUM(${schema.journalEntries.amount})`.as(
              'total',
            ),
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
          .where(
            and(
              eq(schema.transactions.ledgerId, ledgerId),
              eq(schema.journalEntries.accountId, accountId),
              gte(schema.transactions.date, startDate),
              lte(schema.transactions.date, endDate),
            ),
          )
          .groupBy(
            sql`EXTRACT(MONTH FROM ${schema.transactions.date})`,
            sql`EXTRACT(YEAR FROM ${schema.transactions.date})`,
          )
          .as('monthly_total'),
      );

    return {
      average: result[0]?.average || '0',
      stdDev: result[0]?.stdDev || '0',
    };
  }

  async getExportData(ledgerId: string, startDate?: Date, endDate?: Date) {
    const filters: (SQL | undefined)[] = [
      eq(schema.transactions.ledgerId, ledgerId),
    ];

    if (startDate) {
      filters.push(gte(schema.transactions.date, startDate));
    }
    if (endDate) {
      filters.push(lte(schema.transactions.date, endDate));
    }

    return this.db
      .select({
        transactionId: schema.transactions.id,
        date: schema.transactions.date,
        description: schema.transactions.description,
        accountId: schema.accounts.id,
        accountName: schema.accounts.name,
        accountType: schema.accounts.type,
        amount: schema.journalEntries.amount,
        isDeductible: schema.journalEntries.isDeductible,
        taxAmount: schema.journalEntries.taxAmount,
        transactionMetadata: schema.transactions.metadata,
        journalMetadata: schema.journalEntries.metadata,
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
      .where(and(...filters))
      .orderBy(schema.transactions.date);
  }
}
