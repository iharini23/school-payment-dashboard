import { Type } from 'class-transformer';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderStatusDto {
  @IsMongoId()
  @IsNotEmpty()
  collect_id!: string;

  @Type(() => Number)
  @IsNumber()
  order_amount!: number;

  @Type(() => Number)
  @IsNumber()
  transaction_amount!: number;

  @IsString()
  @IsNotEmpty()
  payment_mode!: string;

  @IsOptional()
  @IsString()
  payment_details?: string;

  @IsOptional()
  @IsString()
  bank_reference?: string;

  @IsOptional()
  @IsString()
  payment_message?: string;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsOptional()
  @IsString()
  error_message?: string;

  @IsOptional()
  @IsDateString()
  payment_time?: string;

  @IsString()
  @IsNotEmpty()
  custom_order_id!: string;
}
