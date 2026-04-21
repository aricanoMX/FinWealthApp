import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
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
}
