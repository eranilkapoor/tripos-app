import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CreateTravelDocumentDto } from '../dto/travel-document.dto';
import { TravelDocument } from '../schemas/travel-document.schema';

@Injectable()
export class TravelDocumentsService {
  constructor(@InjectModel(TravelDocument.name) private readonly model: Model<TravelDocument>) {}
  create(dto: CreateTravelDocumentDto) { return this.model.create(dto); }
  list() { return this.model.find().sort({ updatedAt: -1 }).lean().exec(); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Travel document not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('Travel document not found'); return item; }
}
