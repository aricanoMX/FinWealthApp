import { IsUUID, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBudgetDto {
  @ApiProperty({ description: 'The ledger ID this budget belongs to' })
  @IsUUID()
  ledgerId: string;

  @ApiProperty({ description: 'Optional account ID to filter by', required: false })
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @ApiProperty({ description: 'Optional category to filter by', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'The maximum amount allowed for this budget' })
  @IsNumber()
  @Min(0)
  amountLimit: number;

  @ApiProperty({ description: 'The month for this budget (1-12)' })
  @IsNumber()
  @Min(1)
  @Max(12)
  periodMonth: number;

  @ApiProperty({ description: 'The year for this budget' })
  @IsNumber()
  @Min(2000)
  periodYear: number;
}
