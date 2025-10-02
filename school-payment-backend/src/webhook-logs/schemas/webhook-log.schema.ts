import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type WebhookLogDocument = WebhookLog & Document;

@Schema({ timestamps: true })
export class WebhookLog {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  payload!: Record<string, unknown>;
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);
