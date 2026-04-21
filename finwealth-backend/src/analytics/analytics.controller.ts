import { Controller, Get, Query, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserPayload } from '../auth/decorators/current-user.decorator';

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
    @CurrentUser() _user: UserPayload,
  ) {
    const calculationDate = date ? new Date(date) : undefined;
    return this.analyticsService.getNetWorth(ledgerId, calculationDate);
  }
}
