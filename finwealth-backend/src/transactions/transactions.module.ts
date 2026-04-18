import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { CpaEngineModule } from '../cpa-engine/cpa-engine.module';

@Module({
  imports: [CpaEngineModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
