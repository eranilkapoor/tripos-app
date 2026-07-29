import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TriposInvoiceDocument = HydratedDocument<TriposInvoice>;

@Schema({ collection: "tripos_invoices", timestamps: true })
export class TriposInvoice {
  @Prop({ default: "demo-org", index: true })
  organizationId!: string;

  @Prop({ default: "main", index: true })
  branchId!: string;

  @Prop({ required: true, index: true })
  invoiceSeries!: string;

  @Prop({ required: true, index: true })
  invoiceNo!: string;

  @Prop({ required: true })
  invoiceDate!: string;

  @Prop({ default: "IN" })
  countryCode!: string;

  @Prop({ default: "INR" })
  currencyCode!: string;

  @Prop({ default: "₹" })
  currencySymbol!: string;

  @Prop({ default: "GST" })
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

  @Prop({ default: "draft", index: true })
  status!: string;

  @Prop({ default: false })
  locked!: boolean;
}

export const TriposInvoiceSchema = SchemaFactory.createForClass(TriposInvoice);

