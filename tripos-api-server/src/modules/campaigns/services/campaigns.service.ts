import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { listCrmRecords } from '../../../common/utils/crm-list.util';
import { CreateCampaignDto } from '../dto/campaign.dto';
import { Campaign } from '../schemas/campaign.schema';

@Injectable()
export class CampaignsService {
  constructor(@InjectModel(Campaign.name) private readonly model: Model<Campaign>) {}
  create(dto: CreateCampaignDto) { return this.model.create({ ...dto, metadata: dto.metadata ?? {} }); }
  list(query: CrmListQueryDto) { return listCrmRecords(this.model, query, ['name', 'channel', 'source']); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Campaign not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('Campaign not found'); return item; }
}
