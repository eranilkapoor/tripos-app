import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from '../schemas/audit-log.schema';

export type AuditLogInput = {
  action: string;
  method: string;
  path: string;
  statusCode?: number;
  outcome: 'success' | 'failure';
  organizationId?: string;
  branchId?: string;
  actorId?: string;
  actorRole?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLog.name) private readonly model: Model<AuditLog>,
  ) {}

  async record(input: AuditLogInput) {
    await this.model.create({
      ...input,
      metadata: input.metadata ?? {},
    });
  }
}
