import { Injectable, ForbiddenException } from '@nestjs/common';
import { BudgetsRepository } from './budgets.repository';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { DATABASE_CONNECTION } from '../core/database/database.module';
import { Inject } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'finwealth-infra';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class BudgetsService {
  constructor(
    private readonly budgetsRepository: BudgetsRepository,
    @Inject(DATABASE_CONNECTION)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  private async verifyLedgerOwnership(ledgerId: string, userId: string) {
    const ledger = await this.db.query.ledgers.findFirst({
      where: and(
        eq(schema.ledgers.id, ledgerId),
        eq(schema.ledgers.userId, userId),
      ),
    });

    if (!ledger) {
      throw new ForbiddenException('You do not have access to this ledger');
    }
  }

  async createBudget(userId: string, data: CreateBudgetDto) {
    await this.verifyLedgerOwnership(data.ledgerId, userId);
    return this.budgetsRepository.createBudget(data);
  }

  async getBudgetPerformance(
    userId: string,
    ledgerId: string,
    month: number,
    year: number,
  ) {
    await this.verifyLedgerOwnership(ledgerId, userId);
    return this.budgetsRepository.getBudgetPerformance(ledgerId, month, year);
  }
}
