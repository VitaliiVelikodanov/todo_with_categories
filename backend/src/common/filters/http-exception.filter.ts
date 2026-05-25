import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        response.status(status).json({ error: exceptionResponse });
        return;
      }

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const payload = exceptionResponse as {
          error?: string;
          message?: string | string[];
        };

        if (payload.message) {
          const message = Array.isArray(payload.message)
            ? payload.message.join(', ')
            : payload.message;

          response.status(status).json({ error: message });
          return;
        }

        if (payload.error) {
          response.status(status).json({ error: payload.error });
          return;
        }
      }

      response.status(status).json({ error: 'Request failed.' });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Internal server error.',
    });
  }
}
