import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhookLogsService } from './webhook-logs.service';
import { WebhookLog, WebhookLogSchema } from './schemas/webhook-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WebhookLog.name,
        schema: WebhookLogSchema,
      },
    ]),
  ],
  providers: [WebhookLogsService],
  exports: [WebhookLogsService, MongooseModule],
})
export class WebhookLogsModule {}
