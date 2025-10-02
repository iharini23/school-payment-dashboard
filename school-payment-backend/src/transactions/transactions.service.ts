import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { OrderStatus, OrderStatusDocument } from '../order-status/schemas/order-status.schema';
import { TransactionsQueryDto } from './dto/transactions-query.dto';

type TransactionStatusView = {
  collect_id: string;
  status: string;
  payment_time?: Date;
  transaction_amount?: number;
  order_amount?: number;
  school_id: string;
  gateway: string;
  custom_order_id: string;
  payment_details?: string;
  bank_reference?: string;
  payment_mode?: string;
  payment_message?: string;
  error_message?: string;
};

type TransactionListItem = {
  collect_id: string;
  school_id: string;
  gateway: string;
  order_amount: number;
  transaction_amount: number;
  status: string;
  custom_order_id: string;
  payment_time?: Date;
};

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(OrderStatus.name)
    private readonly orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  async getTransactions(query: TransactionsQueryDto) {
    const { page, limit, statuses, school_id, sort, order, from_date, to_date } = query;
    const skip = (page - 1) * limit;

    const basePipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'orders',
          localField: 'collect_id',
          foreignField: '_id',
          as: 'order',
        },
      },
      { $unwind: '$order' },
    ];

    const matchStage: Record<string, unknown> = {};

    if (statuses?.length) {
      matchStage.status = { $in: statuses };
    }

    if (school_id) {
      matchStage['order.school_id'] = school_id;
    }

    if (from_date || to_date) {
      const paymentRange: Record<string, Date> = {};
      if (from_date) {
        paymentRange.$gte = new Date(from_date);
      }
      if (to_date) {
        paymentRange.$lte = new Date(to_date);
      }
      matchStage.payment_time = paymentRange;
    }

    if (Object.keys(matchStage).length > 0) {
      basePipeline.push({ $match: matchStage });
    }

    const sortFieldMap: Record<string, string> = {
      payment_time: 'payment_time',
      order_amount: 'order_amount',
      transaction_amount: 'transaction_amount',
      status: 'status',
    };

    const sortStage: PipelineStage.Sort['$sort'] = {
      [sortFieldMap[sort] ?? 'payment_time']: order === 'asc' ? 1 : -1,
    };

    const projectionStage: PipelineStage.Project['$project'] = {
      _id: 0,
      collect_id: { $toString: '$collect_id' },
      school_id: '$order.school_id',
      gateway: '$order.gateway_name',
      order_amount: 1,
      transaction_amount: 1,
      status: 1,
      custom_order_id: '$order.custom_order_id',
      payment_time: 1,
    };

    const resultsPipeline: PipelineStage[] = [
      ...basePipeline,
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit },
      { $project: projectionStage },
    ];

    const countPipeline: PipelineStage[] = [...basePipeline, { $count: 'count' }];

    const [results, countResult] = await Promise.all([
      this.orderStatusModel.aggregate<TransactionListItem>(resultsPipeline),
      this.orderStatusModel.aggregate<{ count: number }>(countPipeline),
    ]);

    const total = countResult[0]?.count ?? 0;

    return {
      data: results,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getTransactionStatus(customOrderId: string): Promise<TransactionStatusView | null> {
    const [result] = await this.orderStatusModel
      .aggregate<TransactionStatusView>([
        {
          $match: {
            custom_order_id: customOrderId,
          },
        },
        {
          $lookup: {
            from: 'orders',
            localField: 'collect_id',
            foreignField: '_id',
            as: 'order',
          },
        },
        { $unwind: '$order' },
        {
          $project: {
            _id: 0,
            collect_id: { $toString: '$collect_id' },
            status: 1,
            payment_time: 1,
            transaction_amount: 1,
            order_amount: 1,
            school_id: '$order.school_id',
            gateway: '$order.gateway_name',
            custom_order_id: '$order.custom_order_id',
            payment_details: 1,
            bank_reference: 1,
            payment_mode: 1,
            payment_message: 1,
            error_message: 1,
          },
        },
      ])
      .exec();

    return result ?? null;
  }
}
