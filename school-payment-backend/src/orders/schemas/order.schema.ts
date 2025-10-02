import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
class StudentInfo {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  email!: string;
}

const StudentInfoSchema = SchemaFactory.createForClass(StudentInfo);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, index: true })
  school_id!: string;

  @Prop({ required: true })
  trustee_id!: string;

  @Prop({ required: true, type: StudentInfoSchema })
  student_info!: StudentInfo;

  @Prop({ required: true })
  gateway_name!: string;

  @Prop({ required: true, unique: true, index: true })
  custom_order_id!: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
