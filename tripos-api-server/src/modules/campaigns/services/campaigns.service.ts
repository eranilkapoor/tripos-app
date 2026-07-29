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
import { CreateCampaignDto } from '../dto/campaign.dto';
import { Campaign } from '../schemas/campaign.schema';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private readonly model: Model<Campaign>,
  ) {}
  create(dto: CreateCampaignDto) {
    return this.model.create({ ...dto, metadata: dto.metadata ?? {} });
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, ['name', 'channel', 'source']);
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'Campaign not found');
  }
  update(id: string, dto: Partial<CreateCampaignDto>, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      dto,
      'Campaign not found',
    );
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Campaign not found',
    );
  }
  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(this.model, id, query, 'Campaign not found');
  }
}
