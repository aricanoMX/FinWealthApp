import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserPayload } from '../auth/decorators/current-user.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
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
