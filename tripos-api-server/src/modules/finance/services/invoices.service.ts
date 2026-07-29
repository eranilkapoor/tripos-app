import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInvoiceDto } from '../dto/invoice.dto';
import { Invoice } from '../schemas/invoice.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
  ) {}

  async list() {
    return this.invoiceModel.find().sort({ updatedAt: -1 }).lean().exec();
  }

  async nextInvoiceNumber(series: string) {
    const invoices = await this.invoiceModel
      .find({ invoiceSeries: series })
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

