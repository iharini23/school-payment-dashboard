import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PaymentStudentInfoDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsEmail()
  email!: string;
}

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  school_id!: string;

  @IsString()
  @IsNotEmpty()
  trustee_id!: string;

  @ValidateNested()
  @Type(() => PaymentStudentInfoDto)
  student_info!: PaymentStudentInfoDto;

  @IsString()
  @IsNotEmpty()
  gateway_name!: string;

  @Type(() => Number)
  @IsNumber()
  order_amount!: number;

  @IsOptional()
  @IsString()
  payment_mode?: string;

  @IsString()
  @IsNotEmpty()
  custom_order_id!: string;
}
