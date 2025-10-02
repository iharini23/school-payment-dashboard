import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class StudentInfoDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsEmail()
  email!: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  school_id!: string;

  @IsString()
  @IsNotEmpty()
  trustee_id!: string;

  @ValidateNested()
  @Type(() => StudentInfoDto)
  student_info!: StudentInfoDto;

  @IsString()
  @IsNotEmpty()
  gateway_name!: string;

  @IsString()
  @IsNotEmpty()
  custom_order_id!: string;
}
