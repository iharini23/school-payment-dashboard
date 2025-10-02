import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrdersService } from '../orders/orders.service';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from '../order-status/schemas/order-status.schema';
import { OrderStatusService } from '../order-status/order-status.service';
import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

type DemoOrderSeed = CreateOrderDto & {
  order_amount: number;
  transaction_amount: number;
  status: string;
  payment_mode: string;
  payment_message: string;
  payment_time: Date;
  bank_reference?: string;
  error_message?: string;
};

@Injectable()
export class DemoDataService implements OnModuleInit {
  private readonly logger = new Logger(DemoDataService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
    private readonly orderStatusService: OrderStatusService,
    private readonly usersService: UsersService,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name)
    private readonly orderStatusModel: Model<OrderStatusDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    if (this.configService.get('USE_DEMO_DATA') !== 'true') {
      return;
    }

    this.logger.log('Seeding demo data for in-memory database');

    await Promise.all([
      this.orderModel.deleteMany({}).exec(),
      this.orderStatusModel.deleteMany({}).exec(),
      this.userModel.deleteMany({}).exec(),
    ]);

    const defaultUser: CreateUserDto = {
      username: 'admin',
      password: 'admin123',
    };

    await this.usersService.ensureSeedUser(defaultUser);

    const schoolId = this.configService.get<string>('SCHOOL_ID') ?? 'DEMO-SCHOOL-ID';

    const demoOrders: DemoOrderSeed[] = [
      {
        school_id: schoolId,
        trustee_id: 'TRUSTEE-001',
        student_info: {
          name: 'Alice Johnson',
          id: 'STU-1001',
          email: 'alice@example.com',
        },
        gateway_name: 'DemoGateway',
        custom_order_id: 'ORDER-0001',
        order_amount: 5000,
        transaction_amount: 5000,
        status: 'paid',
        payment_mode: 'card',
        payment_message: 'Payment successful',
        payment_time: new Date(Date.now() - 1000 * 60 * 60 * 24),
        bank_reference: 'BANKREF123',
      },
      {
        school_id: schoolId,
        trustee_id: 'TRUSTEE-002',
        student_info: {
          name: 'Brian Smith',
          id: 'STU-1002',
          email: 'brian@example.com',
        },
        gateway_name: 'DemoGateway',
        custom_order_id: 'ORDER-0002',
        order_amount: 6500,
        transaction_amount: 6500,
        status: 'paid',
        payment_mode: 'upi',
        payment_message: 'Payment captured via UPI',
        payment_time: new Date(Date.now() - 1000 * 60 * 60 * 12),
        bank_reference: 'UPI987654',
      },
      {
        school_id: schoolId,
        trustee_id: 'TRUSTEE-003',
        student_info: {
          name: 'Carla Lopez',
          id: 'STU-1003',
          email: 'carla@example.com',
        },
        gateway_name: 'DemoGateway',
        custom_order_id: 'ORDER-0003',
        order_amount: 4200,
        transaction_amount: 0,
        status: 'failed',
        payment_mode: 'card',
        payment_message: 'Card declined',
        payment_time: new Date(Date.now() - 1000 * 60 * 30),
        error_message: 'Insufficient funds',
      },
      {
        school_id: schoolId,
        trustee_id: 'TRUSTEE-004',
        student_info: {
          name: 'Derek Chan',
          id: 'STU-1004',
          email: 'derek@example.com',
        },
        gateway_name: 'DemoGateway',
        custom_order_id: 'ORDER-0004',
        order_amount: 3100,
        transaction_amount: 0,
        status: 'pending',
        payment_mode: 'pending',
        payment_message: 'Awaiting payment confirmation',
        payment_time: new Date(),
      },
      {
        school_id: schoolId,
        trustee_id: 'TRUSTEE-005',
        student_info: {
          name: 'Elena Fisher',
          id: 'STU-1005',
          email: 'elena@example.com',
        },
        gateway_name: 'DemoGateway',
        custom_order_id: 'ORDER-0005',
        order_amount: 7850,
        transaction_amount: 7850,
        status: 'paid',
        payment_mode: 'netbanking',
        payment_message: 'Payment settled successfully',
        payment_time: new Date(Date.now() - 1000 * 60 * 60 * 48),
        bank_reference: 'NET12345',
      },
      {
        school_id: schoolId,
        trustee_id: 'TRUSTEE-006',
        student_info: {
          name: 'Farah Khan',
          id: 'STU-1006',
          email: 'farah@example.com',
        },
        gateway_name: 'DemoGateway',
        custom_order_id: 'ORDER-0006',
        order_amount: 5600,
        transaction_amount: 2800,
        status: 'partial',
        payment_mode: 'card',
        payment_message: 'Half payment received, awaiting balance',
        payment_time: new Date(Date.now() - 1000 * 60 * 60 * 6),
        bank_reference: 'CARD778899',
      },
      {
        school_id: schoolId,
        trustee_id: 'TRUSTEE-007',
        student_info: {
          name: 'George Andrews',
          id: 'STU-1007',
          email: 'george@example.com',
        },
        gateway_name: 'DemoGateway',
        custom_order_id: 'ORDER-0007',
        order_amount: 4800,
        transaction_amount: 0,
        status: 'refunded',
        payment_mode: 'card',
        payment_message: 'Refund processed back to card',
        payment_time: new Date(Date.now() - 1000 * 60 * 60 * 2),
        bank_reference: 'REF123456',
      },
      {
        school_id: schoolId,
        trustee_id: 'TRUSTEE-008',
        student_info: {
          name: 'Hannah Wright',
          id: 'STU-1008',
          email: 'hannah@example.com',
        },
        gateway_name: 'DemoGateway',
        custom_order_id: 'ORDER-0008',
        order_amount: 3900,
        transaction_amount: 0,
        status: 'failed',
        payment_mode: 'upi',
        payment_message: 'UPI approval expired',
        payment_time: new Date(Date.now() - 1000 * 60 * 15),
        error_message: 'Request timed out at bank',
      },
    ];

    for (const order of demoOrders) {
      const {
        order_amount,
        transaction_amount,
        status,
        payment_mode,
        payment_message,
        payment_time,
        bank_reference,
        error_message,
        ...orderDto
      } = order;

      const createdOrder = await this.ordersService.create(orderDto);
      const collectObjectId = createdOrder._id as Types.ObjectId;
      const collectId = collectObjectId.toHexString();

      await this.orderStatusService.upsertByCollectId(collectId, {
        $set: {
          order_amount,
          transaction_amount,
          status,
          payment_mode,
          payment_message,
          payment_time,
          custom_order_id: orderDto.custom_order_id,
          bank_reference,
          error_message,
        },
        $setOnInsert: {
          collect_id: collectObjectId,
        },
      });
    }

    this.logger.log('Demo data seeded');
  }
}
