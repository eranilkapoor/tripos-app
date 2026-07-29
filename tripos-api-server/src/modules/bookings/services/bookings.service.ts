import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { listCrmRecords } from '../../../common/utils/crm-list.util';
import { CreateBookingDto } from '../dto/booking.dto';
import { Booking } from '../schemas/booking.schema';

@Injectable()
export class BookingsService {
  constructor(@InjectModel(Booking.name) private readonly model: Model<Booking>) {}
  create(dto: CreateBookingDto) { return this.model.create({ ...dto, passengers: dto.passengers ?? [], services: dto.services ?? [], documents: dto.documents ?? [] }); }
  list(query: CrmListQueryDto) { return listCrmRecords(this.model, query, ['customerName', 'destination', 'travelDates']); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Booking not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('Booking not found'); return item; }
}
