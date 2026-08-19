import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class OrganizationContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const organizationId = getHeader(req, 'x-organization-id');
    const branchId = getHeader(req, 'x-branch-id');
    if (organizationId) {
      req.query.organizationId = String(
        req.query.organizationId ?? organizationId,
      );
    }
    if (branchId) req.query.branchId = String(req.query.branchId ?? branchId);
    next();
  }
}

function getHeader(req: Request, key: string) {
  const value = req.headers[key];
  return Array.isArray(value) ? value[0] : value;
}
