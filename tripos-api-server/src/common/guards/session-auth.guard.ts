import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_ROUTE } from '../decorators/public.decorator';
import { AuthService } from '../../modules/auth/services/auth.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) return true;

    const request = context
      .switchToHttp()
      .getRequest<
        Request & { user?: unknown; body?: Record<string, unknown> }
      >();
    const token = extractBearer(request.headers.authorization);
    const session = await this.authService.me(token);
    const user = session.user as Record<string, unknown>;
    const organizationId = String(user.tenantId);
    const branchId = String(user.branchId);
    request.user = session.user;
    request.query.organizationId = organizationId;
    request.query.branchId = branchId;
    if (request.body && typeof request.body === 'object') {
      request.body.organizationId = organizationId;
      request.body.branchId = branchId;
    }
    return true;
  }
}

function extractBearer(authorization?: string) {
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : '';
  if (!token) throw new UnauthorizedException('Missing bearer token');
  return token;
}
