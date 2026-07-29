import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { listCrmRecords } from '../../../common/utils/crm-list.util';
import { CreateDestinationDto } from '../dto/destination.dto';
import { Destination } from '../schemas/destination.schema';

@Injectable()
export class DestinationsService {
  constructor(@InjectModel(Destination.name) private readonly model: Model<Destination>) {}
  create(dto: CreateDestinationDto) { return this.model.create({ ...dto, highlights: dto.highlights ?? [] }); }
  list(query: CrmListQueryDto) { return listCrmRecords(this.model, query, ['name', 'country', 'region', 'bestSeason'], { country: 1, name: 1 }); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Destination not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('Destination not found'); return item; }
}
