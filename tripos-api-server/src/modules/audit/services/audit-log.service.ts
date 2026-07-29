import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { scopeFilter } from '../../../common/utils/crm-list.util';
import { AuditLogQueryDto } from '../dto/audit-log-query.dto';
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

  async list(query: AuditLogQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const filter = this.filter(query);
    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    return { items, total, page, limit };
  }

  async exportCsv(query: AuditLogQueryDto) {
    const rows = await this.model
      .find(this.filter(query))
      .sort({ createdAt: -1 })
      .limit(5000)
      .lean()
      .exec();
    const header = [
      'createdAt',
      'organizationId',
      'branchId',
      'actorId',
      'actorRole',
      'action',
      'method',
      'path',
      'statusCode',
      'outcome',
      'ip',
    ];
    return [
      header.join(','),
      ...rows.map((row) =>
        header
          .map((key) =>
            csvCell((row as unknown as Record<string, unknown>)[key]),
          )
          .join(','),
      ),
    ].join('\n');
  }

  private filter(query: AuditLogQueryDto) {
    const filter = scopeFilter(query);
    if (query.actorId) filter.actorId = query.actorId;
    if (query.action) filter.action = query.action;
    if (query.outcome) filter.outcome = query.outcome;
    if (query.from || query.to) {
      filter.createdAt = {
        ...(query.from ? { $gte: new Date(query.from) } : {}),
        ...(query.to ? { $lte: new Date(query.to) } : {}),
      };
    }
    return filter;
  }
}

function csvCell(value: unknown) {
  if (value === undefined || value === null) return '';
  return `"${String(value).replace(/"/g, '""')}"`;
}
