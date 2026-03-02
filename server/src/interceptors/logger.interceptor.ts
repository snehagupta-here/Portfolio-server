import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, url } = req;

    const now = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const statusCode = res.statusCode;
        const message = data?.message || 'success';
        this.logger.log(
          `${method} ${url} ${statusCode} ${Date.now() - now}ms - ${message}`,
        );
      }),
      catchError((error) => {
        const statusCode = res.statusCode || error.status || 500;
        const errorMessage = error.message || 'Internal Server Error';
        this.logger.error(
          `${method} ${url} ${statusCode} ${Date.now() - now}ms - Error: ${errorMessage}`,
        );
        return throwError(() => error);
      }),
    );
  }
}