import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { listCrmRecords } from '../../../common/utils/crm-list.util';
import { CreateQuotationDto } from '../dto/quotation.dto';
import { Quotation } from '../schemas/quotation.schema';

@Injectable()
export class QuotationsService {
  constructor(@InjectModel(Quotation.name) private readonly model: Model<Quotation>) {}

  create(dto: CreateQuotationDto) {
    const pricing = calculatePricing(dto.pricing ?? {}, dto.services ?? []);
    return this.model.create({ ...dto, travellers: dto.travellers ?? 1, services: dto.services ?? [], pricing });
  }

  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, ['customerName', 'destination', 'travelDates']);
  }

  async findOne(id: string) {
    const item = await this.model.findById(id).lean().exec();
    if (!item) throw new NotFoundException('Quotation not found');
    return item;
  }

  async updateStatus(id: string, dto: StatusUpdateDto) {
    const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec();
    if (!item) throw new NotFoundException('Quotation not found');
    return item;
  }
}

function calculatePricing(pricing: Record<string, number>, services: Array<Record<string, unknown>>) {
  const supplierCost = pricing.supplierCost ?? services.reduce((sum, service) => sum + Number(service.cost ?? 0), 0);
  const markup = pricing.markup ?? 0;
  const discount = pricing.discount ?? 0;
  const tax = pricing.tax ?? Math.max(0, supplierCost + markup - discount) * 0.18;
  return { supplierCost, markup, discount, tax, total: supplierCost + markup - discount + tax };
}
