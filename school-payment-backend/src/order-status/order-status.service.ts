import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { CreateOrderStatusDto } from './dto/create-order-status.dto';
import { OrderStatus, OrderStatusDocument } from './schemas/order-status.schema';

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectModel(OrderStatus.name)
    private readonly orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  create(dto: CreateOrderStatusDto): Promise<OrderStatusDocument> {
    return this.orderStatusModel.create(dto);
  }

  upsertByCollectId(
    collectId: string,
    update: UpdateQuery<OrderStatusDocument>,
  ): Promise<OrderStatusDocument | null> {
    const objectId = Types.ObjectId.isValid(collectId) ? new Types.ObjectId(collectId) : collectId;

    return this.orderStatusModel
      .findOneAndUpdate({ collect_id: objectId }, update, {
        new: true,
        upsert: true,
      })
      .exec();
  }

  findOne(filter: FilterQuery<OrderStatusDocument>): Promise<OrderStatusDocument | null> {
    return this.orderStatusModel.findOne(filter).exec();
  }

  findByCollectId(collectId: string): Promise<OrderStatusDocument | null> {
    const objectId = Types.ObjectId.isValid(collectId) ? new Types.ObjectId(collectId) : collectId;
    return this.orderStatusModel.findOne({ collect_id: objectId }).exec();
  }

  findByCustomOrderId(customOrderId: string): Promise<OrderStatusDocument | null> {
    return this.orderStatusModel.findOne({ custom_order_id: customOrderId }).exec();
  }
}
