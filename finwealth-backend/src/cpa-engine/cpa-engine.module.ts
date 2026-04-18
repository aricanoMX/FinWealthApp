import { Module } from '@nestjs/common';
import { DoubleEntryService } from './double-entry.service';

@Module({
  providers: [DoubleEntryService],
  exports: [DoubleEntryService],
})
export class CpaEngineModule {}
