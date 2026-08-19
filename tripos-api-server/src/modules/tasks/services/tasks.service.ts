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
import { CreateTaskDto } from '../dto/task.dto';
import { Task } from '../schemas/task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private readonly model: Model<Task>) {}

  create(dto: CreateTaskDto) {
    return this.model.create({
      ...dto,
      dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
    });
  }

  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, [
      'title',
      'description',
      'module',
      'entityId',
      'assignedTo',
      'priority',
    ]);
  }

  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'Task not found');
  }

  update(id: string, dto: Partial<CreateTaskDto>, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        ...dto,
        ...(dto.dueAt ? { dueAt: new Date(dto.dueAt) } : {}),
      },
      'Task not found',
    );
  }

  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Task not found',
    );
  }

  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(this.model, id, query, 'Task not found');
  }
}
