import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { listCrmRecords } from '../../../common/utils/crm-list.util';
import { CreateSupplierDto } from '../dto/supplier.dto';
import { Supplier } from '../schemas/supplier.schema';

@Injectable()
export class SuppliersService {
  constructor(@InjectModel(Supplier.name) private readonly model: Model<Supplier>) {}
  create(dto: CreateSupplierDto) { return this.model.create({ ...dto, contacts: dto.contacts ?? [], contracts: dto.contracts ?? [], rates: dto.rates ?? [] }); }
  list(query: CrmListQueryDto) { return listCrmRecords(this.model, query, ['name', 'type', 'destination']); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Supplier not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('Supplier not found'); return item; }
}
