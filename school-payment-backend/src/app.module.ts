import { Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnv } from './config/env.schema';
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './auth/auth.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { OrdersModule } from './orders/orders.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { WebhookLogsModule } from './webhook-logs/webhook-logs.module';
import { createInMemoryMongoOptions, stopInMemoryMongo } from './database/in-memory-mongo';
import { DemoDataService } from './demo/demo-data.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        if (configService.get('USE_IN_MEMORY_DB') === 'true') {
          return createInMemoryMongoOptions();
        }

        return {
          uri: configService.get<string>('MONGO_URI'),
        };
      },
    }),
    OrdersModule,
    OrderStatusModule,
    WebhookLogsModule,
    UsersModule,
    AuthModule,
    PaymentModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, DemoDataService],
})
export class AppModule implements OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {}

  async onModuleDestroy() {
    if (this.configService.get('USE_IN_MEMORY_DB') === 'true') {
      await stopInMemoryMongo();
    }
  }
}
