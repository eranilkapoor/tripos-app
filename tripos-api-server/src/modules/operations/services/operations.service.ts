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
import {
  AddOperationTimelineEventDto,
  AssignOperationTaskDto,
  CreateOperationTaskDto,
  EscalateOperationTaskDto,
  UpdateOperationSlaDto,
} from '../dto/operation-task.dto';
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
      startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
      completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
      payload: dto.payload ?? {},
      priority: dto.priority ?? String(dto.payload?.priority ?? 'medium'),
      slaStatus: dto.slaStatus ?? 'on_track',
      timeline: [
        { type: 'created', note: 'Task created', at: new Date().toISOString() },
      ],
      escalations: [],
      dependencies: [],
      tags: [],
      customFields: {},
    });
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(
      this.model,
      query,
      [
        'title',
        'bookingId',
        'customerId',
        'serviceType',
        'assignedTo',
        'ownerId',
        'teamId',
        'supplierId',
      ],
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
  update(
    id: string,
    dto: Partial<CreateOperationTaskDto>,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        ...dto,
        ...(dto.dueAt ? { dueAt: new Date(dto.dueAt) } : {}),
        ...(dto.startedAt ? { startedAt: new Date(dto.startedAt) } : {}),
        ...(dto.completedAt ? { completedAt: new Date(dto.completedAt) } : {}),
      },
      'Operation task not found',
    );
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        status: dto.status,
        $push: {
          timeline: {
            type: 'status_changed',
            note: `Status changed to ${dto.status}`,
            at: new Date().toISOString(),
          },
        },
      },
      'Operation task not found',
    );
  }
  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(
      this.model,
      id,
      query,
      'Operation task not found',
    );
  }

  assign(id: string, dto: AssignOperationTaskDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        assignedTo: dto.assignedTo,
        status: 'assigned',
        $push: {
          timeline: {
            type: 'assigned',
            note: dto.note ?? `Assigned to ${dto.assignedTo}`,
            at: new Date().toISOString(),
          },
        },
      },
      'Operation task not found',
    );
  }

  updateSla(id: string, dto: UpdateOperationSlaDto, query: CrmListQueryDto) {
    const update: Record<string, unknown> = {
      $push: {
        timeline: {
          type: 'sla_updated',
          note: 'SLA updated',
          at: new Date().toISOString(),
          metadata: dto,
        },
      },
    };
    if (dto.dueAt) update.dueAt = new Date(dto.dueAt);
    if (dto.priority) update.priority = dto.priority;
    if (dto.slaStatus) update.slaStatus = dto.slaStatus;
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      update,
      'Operation task not found',
    );
  }

  escalate(id: string, dto: EscalateOperationTaskDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        status: 'issue',
        slaStatus: 'escalated',
        $push: {
          escalations: {
            ...dto,
            severity: dto.severity ?? 'high',
            escalatedAt: new Date().toISOString(),
          },
          timeline: {
            type: 'escalated',
            note: dto.reason,
            at: new Date().toISOString(),
          },
        },
      },
      'Operation task not found',
    );
  }

  addTimelineEvent(
    id: string,
    dto: AddOperationTimelineEventDto,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        $push: {
          timeline: {
            ...dto,
            at: new Date().toISOString(),
          },
        },
      },
      'Operation task not found',
    );
  }
}
