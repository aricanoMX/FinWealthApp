import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
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
