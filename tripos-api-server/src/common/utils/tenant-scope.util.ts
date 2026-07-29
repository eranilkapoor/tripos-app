import { Request } from 'express';
import { CrmListQueryDto } from '../dto/crm-list-query.dto';

type AuthenticatedRequest = Request & {
  user?: { tenantId?: unknown; branchId?: unknown };
};

export function tenantScopedQuery<T extends CrmListQueryDto>(
  query: T,
  request: AuthenticatedRequest,
) {
  return {
    ...query,
    organizationId: String(
      request.user?.tenantId ?? query.organizationId ?? 'demo-org',
    ),
    branchId: String(request.user?.branchId ?? query.branchId ?? ''),
  } as T;
}

export function tenantScopedBody<T extends object>(
  body: T,
  request: AuthenticatedRequest,
) {
  const current = body as Record<string, unknown>;
  return {
    ...body,
    organizationId: String(
      request.user?.tenantId ?? current.organizationId ?? 'demo-org',
    ),
    branchId: String(request.user?.branchId ?? current.branchId ?? ''),
  } as T;
}
