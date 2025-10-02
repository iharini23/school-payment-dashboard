import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { OrdersModule } from '../orders/orders.module';
import { OrderStatusModule } from '../order-status/order-status.module';
import { WebhookLogsModule } from '../webhook-logs/webhook-logs.module';

@Module({
  imports: [ConfigModule, OrdersModule, OrderStatusModule, WebhookLogsModule, HttpModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
