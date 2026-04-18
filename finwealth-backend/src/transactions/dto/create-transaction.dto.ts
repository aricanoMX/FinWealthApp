import { IsString, IsUUID, IsDateString, IsOptional, ValidateNested, ArrayMinSize, IsArray, IsNumberString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJournalEntryDto {
  @IsUUID()
  accountId: string;

  @IsNumberString()
  amount: string; // Use string for decimal precision preservation

  @IsOptional()
  @IsBoolean()
  isDeductible?: boolean;

  @IsOptional()
  @IsNumberString()
  taxAmount?: string;
}

export class CreateTransactionDto {
  @IsUUID()
  ledgerId: string;

  @IsDateString()
  date: string;

  @IsString()
  description: string;

  @IsOptional()
  rawData?: any;

  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @IsArray()
  @ArrayMinSize(2, { message: 'A transaction must have at least two journal entries for double-entry bookkeeping.' })
  @ValidateNested({ each: true })
  @Type(() => CreateJournalEntryDto)
  entries: CreateJournalEntryDto[];
}
