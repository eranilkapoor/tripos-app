import { Request } from 'express';
import { CrmListQueryDto } from '../dto/crm-list-query.dto';

type AuthenticatedRequest = Request & {
  user?: { organizationId?: unknown; branchId?: unknown };
};

export function organizationScopedQuery<T extends CrmListQueryDto>(
  query: T,
  request: AuthenticatedRequest,
) {
  return {
    ...query,
    organizationId: String(
      request.user?.organizationId ?? query.organizationId ?? 'demo-org',
    ),
    branchId: String(request.user?.branchId ?? query.branchId ?? ''),
  } as T;
}

export function organizationScopedBody<T extends object>(
  body: T,
  request: AuthenticatedRequest,
) {
  const current = body as Record<string, unknown>;
  return {
    ...body,
    organizationId: String(
      request.user?.organizationId ?? current.organizationId ?? 'demo-org',
    ),
    branchId: String(request.user?.branchId ?? current.branchId ?? ''),
  } as T;
}
