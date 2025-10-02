import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { OrderStatusService } from '../order-status/order-status.service';
import { OrdersService } from '../orders/orders.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { WebhookLogsService } from '../webhook-logs/webhook-logs.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

type PaymentGatewayResponse = {
  redirect_url?: string | null;
  data?: {
    redirect_url?: string | null;
  };
};

type PaymentWebhookPayload = Record<string, unknown> & {
  order_id?: string;
  collect_id?: string;
  status?: string;
  transaction_amount?: number;
  payment_mode?: string;
  payment_details?: string | Record<string, unknown> | null;
  bank_reference?: string;
  payment_message?: string;
  error_message?: string;
  order_amount?: number;
  payment_time?: string | number | Date;
  custom_order_id?: string;
  data?: {
    order_id?: string;
    custom_order_id?: string;
  };
};

@Injectable()
export class PaymentService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderStatusService: OrderStatusService,
    private readonly webhookLogsService: WebhookLogsService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createPayment(dto: CreatePaymentDto) {
    const orderDto: CreateOrderDto = {
      school_id: dto.school_id,
      trustee_id: dto.trustee_id,
      student_info: dto.student_info,
      gateway_name: dto.gateway_name,
      custom_order_id: dto.custom_order_id,
    };

    const order = await this.ordersService.create(orderDto);

    const orderId =
      order._id instanceof Types.ObjectId ? order._id.toHexString() : String(order._id);

    await this.orderStatusService.upsertByCollectId(orderId, {
      $set: {
        order_amount: dto.order_amount,
        transaction_amount: 0,
        payment_mode: dto.payment_mode ?? 'pending',
        status: 'pending',
        payment_message: 'Awaiting payment',
        custom_order_id: dto.custom_order_id,
      },
      $setOnInsert: {
        collect_id: order._id,
      },
    });

    const isDemoMode = this.configService.get('USE_DEMO_DATA') === 'true';

    if (isDemoMode) {
      return {
        collect_id: orderId,
        redirect_url: `https://demo-payments.local/checkout/${orderId}`,
      };
    }

    const payload = {
      pg_key: this.configService.get<string>('PG_KEY'),
      school_id: dto.school_id,
      collect_id: orderId,
      order_amount: dto.order_amount,
      custom_order_id: dto.custom_order_id,
      payment_mode: dto.payment_mode ?? 'pending',
      student_info: dto.student_info,
    };

    const pgApiKey = this.configService.get<string>('PG_API_KEY');
    const pgApiUrl = this.configService.get<string>('PG_API_URL');

    if (!pgApiKey || !pgApiUrl) {
      throw new BadGatewayException('Payment gateway configuration is invalid');
    }

    const token = jwt.sign(payload, pgApiKey, {
      algorithm: 'HS256',
      expiresIn: '5m',
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post<PaymentGatewayResponse>(pgApiUrl, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      return {
        collect_id: orderId,
        redirect_url: response.data?.redirect_url ? response.data?.redirect_url : null,
      };
    } catch {
      throw new BadGatewayException('Failed to create payment');
    }
  }

  async handleWebhook(payload: PaymentWebhookPayload) {
    await this.webhookLogsService.create({ payload });

    const collectId = payload.order_id ?? payload.collect_id ?? payload.data?.order_id;

    if (!collectId) {
      throw new BadGatewayException('Webhook payload missing collect_id');
    }

    const paymentTime = payload.payment_time ? new Date(payload.payment_time) : new Date();

    const collectObjectId = Types.ObjectId.isValid(collectId)
      ? new Types.ObjectId(collectId)
      : collectId;

    await this.orderStatusService.upsertByCollectId(collectId, {
      $set: {
        status: payload.status ?? 'unknown',
        transaction_amount: payload.transaction_amount ?? 0,
        payment_mode: payload.payment_mode,
        payment_details: payload.payment_details ?? undefined,
        bank_reference: payload.bank_reference,
        payment_message: payload.payment_message,
        error_message: payload.error_message,
        order_amount: payload.order_amount,
        payment_time: paymentTime,
        custom_order_id: payload.custom_order_id ?? payload.data?.custom_order_id,
      },
      $setOnInsert: {
        collect_id: collectObjectId,
      },
    });

    return { success: true };
  }
}
