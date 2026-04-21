import { Controller, Get, Query, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('net-worth')
  @ApiOperation({
    summary: 'Calculate net worth (Assets + Liabilities) for a specific ledger',
  })
  @ApiQuery({ name: 'ledgerId', required: true, type: String })
  @ApiQuery({ name: 'date', required: false, type: Date })
  @ApiResponse({
    status: 200,
    description: 'The net worth has been successfully calculated.',
    schema: {
      example: {
        assets: '15000.00',
        liabilities: '-5000.00',
        netWorth: '10000.00',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. JWT token missing or invalid.',
  })
  async getNetWorth(
    @Query('ledgerId', ParseUUIDPipe) ledgerId: string,
    @Query('date') date?: string,
  ) {
    const calculationDate = date ? new Date(date) : undefined;
    return this.analyticsService.getNetWorth(ledgerId, calculationDate);
  }

  @Get('cash-flow')
  @ApiOperation({
    summary: 'Calculate cash flow (Income vs Expenses) for a specific period',
  })
  @ApiQuery({ name: 'ledgerId', required: true, type: String })
  @ApiQuery({ name: 'startDate', required: true, type: Date })
  @ApiQuery({ name: 'endDate', required: true, type: Date })
  @ApiResponse({
    status: 200,
    description: 'The cash flow has been successfully calculated.',
    schema: {
      example: {
        income: '5000.00',
        expenses: '3500.00',
        netCashFlow: '1500.00',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. JWT token missing or invalid.',
  })
  async getCashFlow(
    @Query('ledgerId', ParseUUIDPipe) ledgerId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getCashFlow(
      ledgerId,
      new Date(startDate),
      new Date(endDate),
    );
  }
}
