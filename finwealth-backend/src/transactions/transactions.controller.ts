import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const result =
      await this.transactionsService.createTransaction(createTransactionDto);
    return {
      success: true,
      data: result,
    };
  }
}
