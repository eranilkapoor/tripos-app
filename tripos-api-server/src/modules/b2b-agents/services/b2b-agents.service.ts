import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { listCrmRecords } from '../../../common/utils/crm-list.util';
import { CreateB2BAgentDto } from '../dto/b2b-agent.dto';
import { B2BAgent } from '../schemas/b2b-agent.schema';

@Injectable()
export class B2BAgentsService {
  constructor(@InjectModel(B2BAgent.name) private readonly model: Model<B2BAgent>) {}
  create(dto: CreateB2BAgentDto) { return this.model.create({ ...dto, creditLimit: dto.creditLimit ?? 0, kycDocuments: dto.kycDocuments ?? [] }); }
  list(query: CrmListQueryDto) { return listCrmRecords(this.model, query, ['agencyName', 'contactName', 'email', 'phone', 'market']); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('B2B agent not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('B2B agent not found'); return item; }
}
