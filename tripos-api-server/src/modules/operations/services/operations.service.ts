import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import {
  findScopedCrmRecord,
  listCrmRecords,
  updateScopedCrmRecord,
} from '../../../common/utils/crm-list.util';
import { CreateOperationTaskDto } from '../dto/operation-task.dto';
import { OperationTask } from '../schemas/operation-task.schema';

@Injectable()
export class OperationsService {
  constructor(
    @InjectModel(OperationTask.name)
    private readonly model: Model<OperationTask>,
  ) {}
  create(dto: CreateOperationTaskDto) {
    return this.model.create({
      ...dto,
      dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
      payload: dto.payload ?? {},
    });
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(
      this.model,
      query,
      ['title', 'bookingCode', 'serviceType', 'owner'],
      { dueAt: 1, updatedAt: -1 },
    );
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(
      this.model,
      id,
      query,
      'Operation task not found',
    );
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Operation task not found',
    );
  }
}
