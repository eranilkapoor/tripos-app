import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CreateCampaignDto } from '../dto/campaign.dto';
import { Campaign } from '../schemas/campaign.schema';

@Injectable()
export class CampaignsService {
  constructor(@InjectModel(Campaign.name) private readonly model: Model<Campaign>) {}
  create(dto: CreateCampaignDto) { return this.model.create({ ...dto, metadata: dto.metadata ?? {} }); }
  list() { return this.model.find().sort({ updatedAt: -1 }).lean().exec(); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Campaign not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('Campaign not found'); return item; }
}
