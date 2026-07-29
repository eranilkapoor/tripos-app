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
import { CreateB2BAgentDto } from '../dto/b2b-agent.dto';
import { B2BAgent } from '../schemas/b2b-agent.schema';

@Injectable()
export class B2BAgentsService {
  constructor(
    @InjectModel(B2BAgent.name) private readonly model: Model<B2BAgent>,
  ) {}
  create(dto: CreateB2BAgentDto) {
    return this.model.create({
      ...dto,
      creditLimit: dto.creditLimit ?? 0,
      kycDocuments: dto.kycDocuments ?? [],
    });
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, [
      'agencyName',
      'contactName',
      'email',
      'phone',
      'market',
    ]);
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'B2B agent not found');
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'B2B agent not found',
    );
  }
}
