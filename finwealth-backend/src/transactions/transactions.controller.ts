import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new financial transaction with double-entry validation',
  })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created and balanced.',
    schema: {
      example: {
        success: true,
        data: { transactionId: 'uuid', ledgerId: 'uuid', date: '2023-10-01' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Double-entry violation or invalid payload.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. JWT token missing or invalid.',
  })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() user: UserPayload,
  ) {
    // user.userId contains the Supabase user ID
    const result = await this.transactionsService.createTransaction(
      createTransactionDto,
      user.userId,
    );
    return {
      success: true,
      data: result,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get paginated transactions with optional date filters',
  })
  @ApiQuery({ name: 'ledgerId', type: 'string', required: true })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 20 })
  @ApiQuery({ name: 'offset', type: 'number', required: false, example: 0 })
  @ApiQuery({
    name: 'startDate',
    type: 'string',
    required: false,
    example: '2023-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    type: 'string',
    required: false,
    example: '2023-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of transactions.',
    schema: {
      example: {
        success: true,
        data: [],
        total: 0,
      },
    },
  })
  async getTransactions(
    @Query('ledgerId') ledgerId: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @CurrentUser() user: UserPayload,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const parsedStartDate = startDate ? new Date(startDate) : undefined;
    const parsedEndDate = endDate ? new Date(endDate) : undefined;

    const result = await this.transactionsService.getTransactions(
      ledgerId,
      limit,
      offset,
      parsedStartDate,
      parsedEndDate,
    );

    return {
      success: true,
      data: result.data,
      total: result.total,
    };
  }

  @Get('suggestions')
  @ApiOperation({
    summary: 'Get most used accounts as suggestions for a ledger',
  })
  @ApiQuery({ name: 'ledgerId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    description: 'List of account suggestions based on frequency.',
    schema: {
      example: {
        success: true,
        data: [
          { accountId: 'uuid', name: 'Alimentos', count: 12 },
          { accountId: 'uuid', name: 'Transporte', count: 8 },
        ],
      },
    },
  })
  async getSuggestions(
    @Query('ledgerId') ledgerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const results = await this.transactionsService.getAccountSuggestions(
      ledgerId,
      user.userId,
    );
    return {
      success: true,
      data: results,
    };
  }
}
