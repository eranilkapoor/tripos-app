import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { listCrmRecords } from '../../../common/utils/crm-list.util';
import { CreateVoucherDto } from '../dto/voucher.dto';
import { Voucher } from '../schemas/voucher.schema';

@Injectable()
export class VouchersService {
  constructor(@InjectModel(Voucher.name) private readonly model: Model<Voucher>) {}
  create(dto: CreateVoucherDto) { return this.model.create({ ...dto, lineItems: dto.lineItems ?? [] }); }
  list(query: CrmListQueryDto) { return listCrmRecords(this.model, query, ['bookingId', 'customerName', 'voucherType', 'supplierName', 'confirmationNumber']); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Voucher not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('Voucher not found'); return item; }
}
