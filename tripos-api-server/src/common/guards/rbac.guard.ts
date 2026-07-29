import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_PERMISSIONS } from '../decorators/permissions.decorator';
import { REQUIRED_ROLES } from '../decorators/roles.decorator';

type RequestUser = {
  role?: string;
  permissions?: string[];
};

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<string[]>(REQUIRED_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    const permissions = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_PERMISSIONS,
      [context.getHandler(), context.getClass()],
    );

    if (!roles?.length && !permissions?.length) return true;

    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = request.user;
    if (!user) throw new ForbiddenException('Access denied');

    if (roles?.length && (!user.role || !roles.includes(user.role))) {
      throw new ForbiddenException('Role is not allowed');
    }

    const userPermissions = user.permissions ?? [];
    if (userPermissions.includes('*')) return true;

    const hasPermissions =
      !permissions?.length ||
      permissions.every((permission) => userPermissions.includes(permission));
    if (!hasPermissions) throw new ForbiddenException('Permission is missing');

    return true;
  }
}
