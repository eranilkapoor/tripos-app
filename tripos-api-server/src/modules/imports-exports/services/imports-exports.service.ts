import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import {
  deleteScopedCrmRecord,
  findScopedCrmRecord,
  listCrmRecords,
  updateScopedCrmRecord,
} from '../../../common/utils/crm-list.util';
import { CreateImportExportJobDto } from '../dto/import-export-job.dto';
import { ImportExportJob } from '../schemas/import-export-job.schema';

@Injectable()
export class ImportsExportsService {
  constructor(
    @InjectModel(ImportExportJob.name)
    private readonly model: Model<ImportExportJob>,
  ) {}
  create(dto: CreateImportExportJobDto) {
    return this.model.create(dto);
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, [
      'module',
      'fileName',
      'format',
      'jobType',
      'requestedBy',
    ]);
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(
      this.model,
      id,
      query,
      'Import/export job not found',
    );
  }
  update(
    id: string,
    dto: Partial<CreateImportExportJobDto>,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      dto,
      'Import/export job not found',
    );
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Import/export job not found',
    );
  }
  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(
      this.model,
      id,
      query,
      'Import/export job not found',
    );
  }
}
