import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { listCrmRecords } from '../../../common/utils/crm-list.util';
import { CreateItineraryDto } from '../dto/itinerary.dto';
import { Itinerary } from '../schemas/itinerary.schema';

@Injectable()
export class ItinerariesService {
  constructor(@InjectModel(Itinerary.name) private readonly model: Model<Itinerary>) {}
  create(dto: CreateItineraryDto) { return this.model.create({ ...dto, days: dto.days ?? [], images: dto.images ?? [] }); }
  list(query: CrmListQueryDto) { return listCrmRecords(this.model, query, ['title', 'destination', 'theme']); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Itinerary not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('Itinerary not found'); return item; }
}
