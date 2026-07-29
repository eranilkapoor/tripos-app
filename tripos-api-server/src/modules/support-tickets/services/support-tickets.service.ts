import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CreateSupportTicketDto } from '../dto/support-ticket.dto';
import { SupportTicket } from '../schemas/support-ticket.schema';

@Injectable()
export class SupportTicketsService {
  constructor(@InjectModel(SupportTicket.name) private readonly model: Model<SupportTicket>) {}
  create(dto: CreateSupportTicketDto) { return this.model.create(dto); }
  list() { return this.model.find().sort({ updatedAt: -1 }).lean().exec(); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Support ticket not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('Support ticket not found'); return item; }
}
