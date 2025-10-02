import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  findById(id: string): Promise<OrderDocument | null> {
    return this.orderModel.findById(id).exec();
  }

  findBySchool(schoolId: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ school_id: schoolId }).exec();
  }
}
