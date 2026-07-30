import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../common/dto/status-update.dto';
import {
  deleteScopedCrmRecord,
  findScopedCrmRecord,
  listCrmRecords,
  updateScopedCrmRecord,
} from '../../common/utils/crm-list.util';
import {
  CreateSavedReportDto,
  RunDueSavedReportsDto,
  RunSavedReportDto,
} from './dto/saved-report.dto';
import { ReportingService } from './reporting.service';
import { SavedReport } from './schemas/saved-report.schema';

@Injectable()
export class SavedReportsService {
  constructor(
    @InjectModel(SavedReport.name)
    private readonly model: Model<SavedReport>,
    private readonly reportingService: ReportingService,
  ) {}

  create(dto: CreateSavedReportDto) {
    const now = new Date();
    return this.model.create({
      ...dto,
      filters: dto.filters ?? {},
      schedule: dto.schedule ?? {},
      recipients: dto.recipients ?? [],
      nextRunAt: calculateNextRun(dto.schedule ?? {}, now),
    });
  }

  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, ['name', 'reportType']);
  }

  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'Saved report not found');
  }

  update(
    id: string,
    dto: Partial<CreateSavedReportDto>,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        ...dto,
        ...(dto.schedule
          ? { nextRunAt: calculateNextRun(dto.schedule, new Date()) }
          : {}),
      },
      'Saved report not found',
    );
  }

  async run(id: string, dto: RunSavedReportDto, query: CrmListQueryDto) {
    const saved = await findScopedCrmRecord(
      this.model,
      id,
      query,
      'Saved report not found',
    );
    const reportQuery = { ...query, ...(dto.filters ?? saved.filters ?? {}) };
    const data = await this.resolveReport(
      String(saved.reportType),
      reportQuery,
    );
    const generatedAt = new Date();
    await this.model
      .updateOne(
        { _id: id },
        {
          lastRunAt: generatedAt,
          nextRunAt: calculateNextRun(saved.schedule ?? {}, generatedAt),
          lastRunResult: {
            status: 'success',
            generatedAt: generatedAt.toISOString(),
            rows: estimateRows(data),
          },
        },
      )
      .exec();
    return { report: saved, data, generatedAt: generatedAt.toISOString() };
  }

  async runDue(dto: RunDueSavedReportsDto, query: CrmListQueryDto) {
    const now = dto.now ? new Date(dto.now) : new Date();
    const filter: Record<string, unknown> = {
      organizationId: query.organizationId ?? 'demo-org',
      status: 'active',
      $or: [{ nextRunAt: { $exists: false } }, { nextRunAt: { $lte: now } }],
    };
    if (query.branchId) filter.branchId = query.branchId;
    if (dto.reportType) filter.reportType = dto.reportType;

    const reports = await this.model
      .find(filter)
      .sort({ nextRunAt: 1, updatedAt: 1 })
      .limit(query.limit ?? 25)
      .lean()
      .exec();

    const results = [];
    for (const report of reports) {
      const reportQuery = {
        ...query,
        ...(report.filters ?? {}),
        organizationId: report.organizationId,
        branchId: report.branchId,
      };
      try {
        const data = await this.resolveReport(
          String(report.reportType),
          reportQuery,
        );
        const nextRunAt = calculateNextRun(report.schedule ?? {}, now);
        await this.model
          .updateOne(
            { _id: report._id },
            {
              lastRunAt: now,
              nextRunAt,
              lastRunResult: {
                status: 'success',
                generatedAt: now.toISOString(),
                rows: estimateRows(data),
              },
            },
          )
          .exec();
        results.push({
          id: String(report._id),
          name: report.name,
          status: 'success',
          nextRunAt,
        });
      } catch (error) {
        await this.model
          .updateOne(
            { _id: report._id },
            {
              lastRunAt: now,
              lastRunResult: {
                status: 'failed',
                generatedAt: now.toISOString(),
                error: error instanceof Error ? error.message : String(error),
              },
            },
          )
          .exec();
        results.push({
          id: String(report._id),
          name: report.name,
          status: 'failed',
        });
      }
    }

    return {
      generatedAt: now.toISOString(),
      total: results.length,
      results,
    };
  }

  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Saved report not found',
    );
  }

  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(
      this.model,
      id,
      query,
      'Saved report not found',
    );
  }

  private resolveReport(reportType: string, query: CrmListQueryDto) {
    if (reportType === 'sales-funnel')
      return this.reportingService.salesFunnel(query);
    if (reportType === 'operations')
      return this.reportingService.operations(query);
    if (reportType === 'finance') return this.reportingService.finance(query);
    return this.reportingService.overview(query);
  }
}

function calculateNextRun(
  schedule: Record<string, unknown>,
  from: Date,
): Date | undefined {
  const frequency = String(schedule.frequency ?? '').toLowerCase();
  if (!frequency || frequency === 'manual') return undefined;

  const next = new Date(from);
  if (frequency === 'hourly') next.setHours(next.getHours() + 1);
  else if (frequency === 'daily') next.setDate(next.getDate() + 1);
  else if (frequency === 'weekly') next.setDate(next.getDate() + 7);
  else if (frequency === 'monthly') next.setMonth(next.getMonth() + 1);
  else return undefined;

  const time = typeof schedule.time === 'string' ? schedule.time : undefined;
  if (time && /^\d{2}:\d{2}$/.test(time)) {
    const [hours, minutes] = time.split(':').map(Number);
    next.setHours(hours, minutes, 0, 0);
    if (next <= from) {
      if (frequency === 'hourly') next.setHours(next.getHours() + 1);
      else if (frequency === 'daily') next.setDate(next.getDate() + 1);
      else if (frequency === 'weekly') next.setDate(next.getDate() + 7);
      else if (frequency === 'monthly') next.setMonth(next.getMonth() + 1);
    }
  }

  return next;
}

function estimateRows(data: unknown): number {
  if (Array.isArray(data)) return data.length;
  if (!data || typeof data !== 'object') return 1;
  const record = data as Record<string, unknown>;
  if (Array.isArray(record.items)) return record.items.length;
  if (Array.isArray(record.data)) return record.data.length;
  if (record.totals && typeof record.totals === 'object') {
    return Object.keys(record.totals).length;
  }
  return Object.keys(record).length;
}
