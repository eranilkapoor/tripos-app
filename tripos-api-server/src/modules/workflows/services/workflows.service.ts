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
import { CreateWorkflowRuleDto } from '../dto/workflow-rule.dto';
import { WorkflowRule } from '../schemas/workflow-rule.schema';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectModel(WorkflowRule.name) private readonly model: Model<WorkflowRule>,
  ) {}

  create(dto: CreateWorkflowRuleDto) {
    return this.model.create({ ...dto, code: dto.code.toLowerCase() });
  }

  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, [
      'name',
      'code',
      'module',
      'trigger',
    ]);
  }

  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(
      this.model,
      id,
      query,
      'Workflow rule not found',
    );
  }

  update(
    id: string,
    dto: Partial<CreateWorkflowRuleDto>,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      dto.code ? { ...dto, code: dto.code.toLowerCase() } : dto,
      'Workflow rule not found',
    );
  }

  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Workflow rule not found',
    );
  }

  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(
      this.model,
      id,
      query,
      'Workflow rule not found',
    );
  }
}
