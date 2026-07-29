import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import {
  findScopedCrmRecord,
  scopeFilter,
} from '../../../common/utils/crm-list.util';
import { buildDocumentTemplate } from '../../../common/utils/document-template.util';
import { CreateInvoiceDto } from '../dto/invoice.dto';
import { Invoice } from '../schemas/invoice.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
  ) {}

  async list(query: CrmListQueryDto) {
    return this.invoiceModel
      .find(scopeFilter(query))
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
  }

  async nextInvoiceNumber(series: string, query: CrmListQueryDto) {
    const invoices = await this.invoiceModel
      .find(scopeFilter(query, { invoiceSeries: series }))
      .select({ invoiceNo: 1 })
      .lean()
      .exec();
    const maxLength = Math.max(
      4,
      ...invoices.map((invoice) => String(invoice.invoiceNo).length),
    );
    const maxNumber = Math.max(
      0,
      ...invoices.map((invoice) => Number(invoice.invoiceNo) || 0),
    );
    return {
      invoiceSeries: series,
      invoiceNo: String(maxNumber + 1).padStart(maxLength, '0'),
    };
  }

  async create(dto: CreateInvoiceDto) {
    const totals = calculateInvoiceTotals(dto.entries, dto.taxRate);
    const invoice = await this.invoiceModel.create({
      ...dto,
      totals,
      status: dto.status ?? 'draft',
      locked: dto.locked ?? false,
    });
    return {
      message: 'TripOS invoice saved.',
      invoice,
    };
  }

  async document(id: string, query: CrmListQueryDto) {
    const invoice = await findScopedCrmRecord(
      this.invoiceModel,
      id,
      query,
      'Invoice not found',
    );
    return buildDocumentTemplate({
      type: 'invoice',
      title: `Invoice ${String((invoice as { invoiceSeries?: string }).invoiceSeries ?? '')}${String((invoice as { invoiceNo?: string }).invoiceNo ?? id)}`,
      fileName: `invoice-${id}.pdf`,
      organizationId: (invoice as { organizationId?: string }).organizationId,
      branchId: (invoice as { branchId?: string }).branchId,
      sections: [
        {
          heading: 'Invoice',
          rows: [
            {
              invoiceSeries: (invoice as { invoiceSeries?: string })
                .invoiceSeries,
              invoiceNo: (invoice as { invoiceNo?: string }).invoiceNo,
              invoiceDate: (invoice as { invoiceDate?: string }).invoiceDate,
              countryCode: (invoice as { countryCode?: string }).countryCode,
              currencyCode: (invoice as { currencyCode?: string }).currencyCode,
              status: (invoice as { status?: string }).status,
            },
          ],
        },
        {
          heading: 'Customer',
          rows: [
            ((invoice as { customer?: Record<string, unknown> }).customer ??
              {}) as Record<string, unknown>,
          ],
        },
        {
          heading: 'Entries',
          rows:
            (invoice as { entries?: Array<Record<string, unknown>> }).entries ??
            [],
        },
      ],
      totals: (invoice as { totals?: Record<string, unknown> }).totals,
    });
  }
}

export function calculateInvoiceTotals(
  entries: Array<Record<string, unknown>>,
  taxRate: number,
) {
  const subtotal = entries.reduce(
    (sum, entry) => sum + Number(entry.total ?? 0),
    0,
  );
  const taxAmount = subtotal * (Number(taxRate || 0) / 100);
  return {
    subtotal,
    taxAmount,
    taxBasis: subtotal,
    totalPayable: subtotal + taxAmount,
  };
}
