import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const tenantId = getHeader(req, 'x-tenant-id') ?? 'demo-org';
    const branchId = getHeader(req, 'x-branch-id');
    req.query.organizationId = String(req.query.organizationId ?? tenantId);
    if (branchId) req.query.branchId = String(req.query.branchId ?? branchId);
    next();
  }
}

function getHeader(req: Request, key: string) {
  const value = req.headers[key];
  return Array.isArray(value) ? value[0] : value;
}
