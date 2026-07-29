import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import {
  deleteScopedCrmRecord,
  findScopedCrmRecord,
  listCrmRecords,
  updateScopedCrmRecord,
} from '../../../common/utils/crm-list.util';
import { buildDocumentTemplate } from '../../../common/utils/document-template.util';
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

  update(id: string, dto: Partial<CreateQuotationDto>, query: CrmListQueryDto) {
    const update =
      dto.pricing || dto.services
        ? {
            ...dto,
            pricing: calculatePricing(dto.pricing ?? {}, dto.services ?? []),
          }
        : dto;
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      update,
      'Quotation not found',
    );
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

  async calculate(id: string, query: CrmListQueryDto) {
    const quotation = await this.findOne(id, query);
    return {
      quotationId: id,
      pricing: calculatePricing(
        (quotation as { pricing?: Record<string, number> }).pricing ?? {},
        (quotation as { services?: Array<Record<string, unknown>> }).services ??
          [],
      ),
    };
  }

  send(id: string, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: 'sent' },
      'Quotation not found',
    );
  }

  accept(id: string, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: 'accepted' },
      'Quotation not found',
    );
  }

  async pdf(id: string, query: CrmListQueryDto) {
    const quotation = await this.findOne(id, query);
    return buildDocumentTemplate({
      type: 'quotation',
      title: `Quotation ${String((quotation as { customerName?: string }).customerName ?? id)}`,
      fileName: `quotation-${id}.pdf`,
      organizationId: (quotation as { organizationId?: string }).organizationId,
      branchId: (quotation as { branchId?: string }).branchId,
      sections: [
        {
          heading: 'Quotation',
          rows: [
            {
              customer: (quotation as { customerName?: string }).customerName,
              destination: (quotation as { destination?: string }).destination,
              travelDates: (quotation as { travelDates?: string }).travelDates,
              travellers: (quotation as { travellers?: number }).travellers,
              status: (quotation as { status?: string }).status,
            },
          ],
        },
        {
          heading: 'Services',
          rows:
            (quotation as { services?: Array<Record<string, unknown>> })
              .services ?? [],
        },
      ],
      totals: (quotation as { pricing?: Record<string, unknown> }).pricing,
    });
  }

  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(this.model, id, query, 'Quotation not found');
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
