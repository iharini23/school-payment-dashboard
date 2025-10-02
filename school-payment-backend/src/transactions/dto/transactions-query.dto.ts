import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

const SORT_FIELDS = ['payment_time', 'order_amount', 'transaction_amount', 'status'] as const;
const SORT_ORDERS = ['asc', 'desc'] as const;

export class TransactionsQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page = 1;

  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  limit = 10;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sort: (typeof SORT_FIELDS)[number] = 'payment_time';

  @IsOptional()
  @IsIn(SORT_ORDERS)
  order: (typeof SORT_ORDERS)[number] = 'desc';

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
      : Array.isArray(value)
        ? value.map((v) => `${v}`.trim()).filter(Boolean)
        : undefined,
  )
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  statuses?: string[];

  @IsOptional()
  @IsString()
  school_id?: string;

  @IsOptional()
  @IsDateString()
  from_date?: string;

  @IsOptional()
  @IsDateString()
  to_date?: string;
}
