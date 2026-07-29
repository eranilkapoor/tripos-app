import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../common/dto/status-update.dto';
import {
  findScopedCrmRecord,
  listCrmRecords,
  updateScopedCrmRecord,
} from '../../common/utils/crm-list.util';
import {
  CreateSavedReportDto,
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
    return this.model.create({
      ...dto,
      filters: dto.filters ?? {},
      schedule: dto.schedule ?? {},
      recipients: dto.recipients ?? [],
    });
  }

  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, ['name', 'reportType']);
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
    await this.model.updateOne({ _id: id }, { lastRunAt: new Date() }).exec();
    return { report: saved, data, generatedAt: new Date().toISOString() };
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

  private resolveReport(reportType: string, query: CrmListQueryDto) {
    if (reportType === 'sales-funnel')
      return this.reportingService.salesFunnel(query);
    if (reportType === 'operations')
      return this.reportingService.operations(query);
    if (reportType === 'finance') return this.reportingService.finance(query);
    return this.reportingService.overview(query);
  }
}
