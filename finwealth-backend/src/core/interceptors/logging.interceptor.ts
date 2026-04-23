import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<{ method: string; url: string }>();
    const { method, url } = req;
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(`[HTTP] ${method} ${url} - ${Date.now() - now}ms`),
        ),
      );
  }
}
