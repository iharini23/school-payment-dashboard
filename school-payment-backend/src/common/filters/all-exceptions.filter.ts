import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: Record<string, unknown> | string = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const httpResponse = exception.getResponse();
      responseBody =
        typeof httpResponse === 'string' ? httpResponse : (httpResponse as Record<string, unknown>);
    } else if (exception instanceof Error) {
      responseBody = exception.message;
    }

    const payload: Record<string, unknown> =
      typeof responseBody === 'string' ? { message: responseBody } : responseBody;

    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error(JSON.stringify(exception));
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...payload,
    });
  }
}
