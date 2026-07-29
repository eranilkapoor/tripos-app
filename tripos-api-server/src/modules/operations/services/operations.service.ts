import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CreateOperationTaskDto } from '../dto/operation-task.dto';
import { OperationTask } from '../schemas/operation-task.schema';

@Injectable()
export class OperationsService {
  constructor(@InjectModel(OperationTask.name) private readonly model: Model<OperationTask>) {}
  create(dto: CreateOperationTaskDto) { return this.model.create({ ...dto, dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined, payload: dto.payload ?? {} }); }
  list() { return this.model.find().sort({ dueAt: 1, updatedAt: -1 }).lean().exec(); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Operation task not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('Operation task not found'); return item; }
}

