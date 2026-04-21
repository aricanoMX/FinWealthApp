import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserPayload } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('budgets')
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new budget' })
  @ApiResponse({ status: 201, description: 'Budget created successfully' })
  async createBudget(
    @CurrentUser() user: UserPayload,
    @Body() createBudgetDto: CreateBudgetDto,
  ) {
    return this.budgetsService.createBudget(user.userId, createBudgetDto);
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get budget performance for a specific period' })
  @ApiQuery({ name: 'ledgerId', type: 'string', required: true })
  @ApiQuery({ name: 'month', type: 'number', required: true })
  @ApiQuery({ name: 'year', type: 'number', required: true })
  @ApiResponse({
    status: 200,
    description: 'Budget performance data retrieved',
  })
  async getPerformance(
    @CurrentUser() user: UserPayload,
    @Query('ledgerId') ledgerId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.budgetsService.getBudgetPerformance(
      user.userId,
      ledgerId,
      parseInt(month, 10),
      parseInt(year, 10),
    );
  }
}
