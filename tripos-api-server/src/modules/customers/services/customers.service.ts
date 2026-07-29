import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { listCrmRecords } from '../../../common/utils/crm-list.util';
import { CreateCustomerDto } from '../dto/customer.dto';
import { Customer } from '../schemas/customer.schema';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private readonly model: Model<Customer>) {}
  create(dto: CreateCustomerDto) { return this.model.create(dto); }
  list(query: CrmListQueryDto) { return listCrmRecords(this.model, query, ['name', 'email', 'phone', 'city', 'country']); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Customer not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('Customer not found'); return item; }
}
