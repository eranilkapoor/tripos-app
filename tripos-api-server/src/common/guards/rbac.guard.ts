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
    let permissions = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_PERMISSIONS,
      [context.getHandler(), context.getClass()],
    );
    permissions = permissions?.length ? permissions : inferPermissions(context);

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

const PROTECTED_MODULES = new Set([
  'leads',
  'customers',
  'quotations',
  'itineraries',
  'bookings',
  'suppliers',
  'operations',
  'b2b-agents',
  'payments',
  'finance',
  'destinations',
  'tour-packages',
  'travel-documents',
  'vouchers',
  'support-tickets',
  'campaigns',
  'notifications',
  'storage',
  'saved-reports',
  'reporting',
  'ai',
  'batch-jobs',
  'settings',
  'tasks',
  'tags',
]);

function inferPermissions(context: ExecutionContext) {
  const request = context.switchToHttp().getRequest<{
    method?: string;
    route?: { path?: string };
    originalUrl?: string;
  }>();
  const path = String(request.route?.path ?? request.originalUrl ?? '')
    .replace(/^\/?api\/v\d+\//, '')
    .replace(/^\/+/, '');
  const moduleName = normalizeModuleName(path.split('/')[0] ?? '');
  if (!PROTECTED_MODULES.has(moduleName)) return [];

  const method = String(request.method ?? 'GET').toUpperCase();
  const action =
    method === 'GET'
      ? path.includes('export') || path.includes('pdf')
        ? 'export'
        : 'read'
      : method === 'POST'
        ? path.includes('approve') || path.includes('accept')
          ? 'approve'
          : 'create'
        : method === 'DELETE'
          ? 'delete'
          : 'update';

  return [`${permissionModule(moduleName)}:${action}`];
}

function normalizeModuleName(value: string) {
  if (value === 'finance') return 'finance';
  if (value === 'storage') return 'storage';
  return value;
}

function permissionModule(moduleName: string) {
  if (moduleName === 'storage') return 'documents';
  if (moduleName === 'support-tickets') return 'support';
  if (moduleName === 'tour-packages') return 'destinations';
  if (moduleName === 'travel-documents') return 'documents';
  if (moduleName === 'saved-reports' || moduleName === 'reporting') {
    return 'reports';
  }
  if (moduleName === 'ai') return 'settings';
  return moduleName;
}
