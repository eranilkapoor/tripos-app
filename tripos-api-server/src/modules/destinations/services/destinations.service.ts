import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CreateDestinationDto } from '../dto/destination.dto';
import { Destination } from '../schemas/destination.schema';

@Injectable()
export class DestinationsService {
  constructor(@InjectModel(Destination.name) private readonly model: Model<Destination>) {}
  create(dto: CreateDestinationDto) { return this.model.create({ ...dto, highlights: dto.highlights ?? [] }); }
  list() { return this.model.find().sort({ country: 1, name: 1 }).lean().exec(); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Destination not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('Destination not found'); return item; }
}
