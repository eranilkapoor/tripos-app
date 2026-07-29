import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ collection: COLLECTION_NAMES.INVOICE, timestamps: true })
export class Invoice {
  @Prop({ default: 'demo-org', index: true })
  organizationId!: string;

  @Prop({ default: 'main', index: true })
  branchId!: string;

  @Prop({ required: true, index: true })
  invoiceSeries!: string;

  @Prop({ required: true, index: true })
  invoiceNo!: string;

  @Prop({ required: true })
  invoiceDate!: string;

  @Prop({ default: 'IN' })
  countryCode!: string;

  @Prop({ default: 'INR' })
  currencyCode!: string;

  @Prop({ default: 'INR' })
  currencySymbol!: string;

  @Prop({ default: 'GST' })
  taxLabel!: string;

  @Prop({ default: 18 })
  taxRate!: number;

  @Prop({ type: Object, required: true })
  provider!: Record<string, unknown>;

  @Prop({ type: Object, required: true })
  customer!: Record<string, unknown>;

  @Prop({ type: [Object], default: [] })
  entries!: Array<Record<string, unknown>>;

  @Prop({ type: Object, required: true })
  totals!: Record<string, number>;

  @Prop({ default: 'draft', index: true })
  status!: string;

  @Prop({ default: false })
  locked!: boolean;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
InvoiceSchema.index(
  { organizationId: 1, invoiceSeries: 1, invoiceNo: 1 },
  { unique: true },
);
InvoiceSchema.index({ organizationId: 1, status: 1, createdAt: -1 });
