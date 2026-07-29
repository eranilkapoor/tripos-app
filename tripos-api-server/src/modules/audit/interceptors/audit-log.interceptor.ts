import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AuditLogService } from '../services/audit-log.service';

type AuthenticatedUser = {
  _id?: unknown;
  id?: unknown;
  tenantId?: unknown;
  branchId?: unknown;
  role?: string;
};

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    const response = context.switchToHttp().getResponse<Response>();
    const startedAt = Date.now();

    if (!shouldAudit(request)) return next.handle();

    return next.handle().pipe(
      tap(() => {
        this.record(
          request,
          response.statusCode,
          'success',
          Date.now() - startedAt,
        );
      }),
      catchError((error: unknown) => {
        const statusCode =
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          typeof (error as { status?: unknown }).status === 'number'
            ? (error as { status: number }).status
            : 500;
        this.record(request, statusCode, 'failure', Date.now() - startedAt);
        return throwError(() => error);
      }),
    );
  }

  private record(
    request: Request & { user?: AuthenticatedUser },
    statusCode: number,
    outcome: 'success' | 'failure',
    durationMs: number,
  ) {
    const user = request.user;
    void this.auditLogService.record({
      action: `${request.method} ${request.path}`,
      method: request.method,
      path: request.path,
      statusCode,
      outcome,
      organizationId: stringOrUndefined(
        user?.tenantId ?? request.query.organizationId,
      ),
      branchId: stringOrUndefined(user?.branchId ?? request.query.branchId),
      actorId: stringOrUndefined(user?._id ?? user?.id),
      actorRole: user?.role,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      metadata: {
        durationMs,
        params: request.params,
      },
    });
  }
}

function shouldAudit(request: Request & { user?: AuthenticatedUser }) {
  if (!request.user) return false;
  if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method)) return true;
  return [
    '/api/v1/finance',
    '/api/v1/payments',
    '/api/v1/travel-documents',
    '/api/v1/tenants',
  ].some((prefix) => request.path.startsWith(prefix));
}

function stringOrUndefined(value: unknown) {
  return value === undefined || value === null || value === ''
    ? undefined
    : String(value);
}
