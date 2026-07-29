import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import {
  findScopedCrmRecord,
  listCrmRecords,
  updateScopedCrmRecord,
} from '../../../common/utils/crm-list.util';
import { CreateQuotationDto } from '../dto/quotation.dto';
import { Quotation } from '../schemas/quotation.schema';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectModel(Quotation.name) private readonly model: Model<Quotation>,
  ) {}

  create(dto: CreateQuotationDto) {
    const pricing = calculatePricing(dto.pricing ?? {}, dto.services ?? []);
    return this.model.create({
      ...dto,
      travellers: dto.travellers ?? 1,
      services: dto.services ?? [],
      pricing,
    });
  }

  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, [
      'customerName',
      'destination',
      'travelDates',
    ]);
  }

  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'Quotation not found');
  }

  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Quotation not found',
    );
  }
}

function calculatePricing(
  pricing: Record<string, number>,
  services: Array<Record<string, unknown>>,
) {
  const supplierCost =
    pricing.supplierCost ??
    services.reduce((sum, service) => sum + Number(service.cost ?? 0), 0);
  const markup = pricing.markup ?? 0;
  const discount = pricing.discount ?? 0;
  const tax =
    pricing.tax ?? Math.max(0, supplierCost + markup - discount) * 0.18;
  return {
    supplierCost,
    markup,
    discount,
    tax,
    total: supplierCost + markup - discount + tax,
  };
}
