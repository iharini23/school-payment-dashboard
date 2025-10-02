import { IsObject } from 'class-validator';

export class CreateWebhookLogDto {
  @IsObject()
  payload!: Record<string, unknown>;
}
