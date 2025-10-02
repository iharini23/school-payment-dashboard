import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Order } from '../../orders/schemas/order.schema';

export type OrderStatusDocument = OrderStatus & Document;

@Schema({ timestamps: true })
export class OrderStatus {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Order.name,
    required: true,
    index: true,
  })
  collect_id!: Types.ObjectId;

  @Prop({ required: true })
  order_amount!: number;

  @Prop({ required: true })
  transaction_amount!: number;

  @Prop({ required: true })
  payment_mode!: string;

  @Prop()
  payment_details?: string;

  @Prop()
  bank_reference?: string;

  @Prop()
  payment_message?: string;

  @Prop({ required: true })
  status!: string;

  @Prop()
  error_message?: string;

  @Prop({ type: Date })
  payment_time?: Date;

  @Prop({ required: true })
  custom_order_id!: string;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);
OrderStatusSchema.index({ custom_order_id: 1 }, { unique: true });
