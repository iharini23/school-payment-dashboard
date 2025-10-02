import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWebhookLogDto } from './dto/create-webhook-log.dto';
import { WebhookLog, WebhookLogDocument } from './schemas/webhook-log.schema';

@Injectable()
export class WebhookLogsService {
  constructor(
    @InjectModel(WebhookLog.name)
    private readonly webhookLogModel: Model<WebhookLogDocument>,
  ) {}

  create(dto: CreateWebhookLogDto) {
    return this.webhookLogModel.create(dto);
  }
}
