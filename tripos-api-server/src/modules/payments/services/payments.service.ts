import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { listCrmRecords } from '../../../common/utils/crm-list.util';
import { CreatePaymentDto } from '../dto/payment.dto';
import { Payment } from '../schemas/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private readonly model: Model<Payment>) {}
  create(dto: CreatePaymentDto) { return this.model.create({ ...dto, currencyCode: dto.currencyCode ?? 'INR', metadata: dto.metadata ?? {} }); }
  list(query: CrmListQueryDto) { return listCrmRecords(this.model, query, ['type', 'partyName', 'bookingId', 'agentId'], { dueDate: 1, updatedAt: -1 }); }
  async summary() {
    const rows = await this.model.find().lean().exec();
    return rows.reduce((summary, row) => {
      const key = `${row.type}_${row.status}`;
      summary[key] = (summary[key] ?? 0) + Number(row.amount ?? 0);
      return summary;
    }, {} as Record<string, number>);
  }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Payment not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const update: Record<string, unknown> = { status: dto.status }; if (dto.status === 'paid') update.paidAt = new Date().toISOString(); const item = await this.model.findByIdAndUpdate(id, update, { new: true }).exec(); if (!item) throw new NotFoundException('Payment not found'); return item; }
}
