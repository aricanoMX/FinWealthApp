import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../core/database/database.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'finwealth-infra/src/schema';
import { and, eq, gte, lt, sql, sum } from 'drizzle-orm';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Injectable()
export class BudgetsRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async createBudget(data: CreateBudgetDto) {
    const [budget] = await this.db
      .insert(schema.budgets)
      .values({
        ledgerId: data.ledgerId,
        accountId: data.accountId,
        category: data.category,
        amountLimit: data.amountLimit.toString(),
        periodMonth: data.periodMonth,
        periodYear: data.periodYear,
      })
      .returning();
    return budget;
  }

  async findByLedger(ledgerId: string) {
    return this.db.query.budgets.findMany({
      where: eq(schema.budgets.ledgerId, ledgerId),
    });
  }

  async getBudgetPerformance(ledgerId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // 1. Get all budgets for this ledger and period
    const budgets = await this.db.query.budgets.findMany({
      where: and(
        eq(schema.budgets.ledgerId, ledgerId),
        eq(schema.budgets.periodMonth, month),
        eq(schema.budgets.periodYear, year),
      ),
    });

    const performanceResults = await Promise.all(
      budgets.map(async (budget) => {
        const conditions = [
          eq(schema.transactions.ledgerId, ledgerId),
          gte(schema.transactions.date, startDate),
          lt(schema.transactions.date, endDate),
        ];

        let result: { total: string | null }[];

        if (budget.accountId) {
          conditions.push(eq(schema.journalEntries.accountId, budget.accountId));
          result = await this.db
            .select({ total: sum(schema.journalEntries.amount) })
            .from(schema.journalEntries)
            .innerJoin(
              schema.transactions,
              eq(schema.journalEntries.transactionId, schema.transactions.id),
            )
            .where(and(...conditions));
        } else if (budget.category) {
          conditions.push(sql`${schema.journalEntries.metadata}->>'category' = ${budget.category}`);
          result = await this.db
            .select({ total: sum(schema.journalEntries.amount) })
            .from(schema.journalEntries)
            .innerJoin(
              schema.transactions,
              eq(schema.journalEntries.transactionId, schema.transactions.id),
            )
            .where(and(...conditions));
        } else {
          // Global budget: Sum all entries where account type is 'expense'
          conditions.push(eq(schema.accounts.type, 'expense'));
          result = await this.db
            .select({ total: sum(schema.journalEntries.amount) })
            .from(schema.journalEntries)
            .innerJoin(
              schema.transactions,
              eq(schema.journalEntries.transactionId, schema.transactions.id),
            )
            .innerJoin(
              schema.accounts,
              eq(schema.journalEntries.accountId, schema.accounts.id),
            )
            .where(and(...conditions));
        }

        const spent = parseFloat(result[0]?.total || '0');
        const limit = parseFloat(budget.amountLimit);

        return {
          id: budget.id,
          accountId: budget.accountId,
          category: budget.category,
          amountLimit: limit,
          amountSpent: spent,
          percentage: limit > 0 ? (spent / limit) * 100 : 0,
        };
      }),
    );

    return performanceResults;
  }
}
