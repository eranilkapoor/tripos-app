import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type QuotationDocument = HydratedDocument<Quotation>;

@Schema({ collection: COLLECTION_NAMES.QUOTATION, timestamps: true })
export class Quotation {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ index: true }) leadId?: string;
  @Prop({ required: true, trim: true }) customerName!: string;
  @Prop({ required: true, trim: true, index: true }) destination!: string;
  @Prop({ trim: true }) travelDates?: string;
  @Prop({ default: 1 }) travellers!: number;
  @Prop({ type: [Object], default: [] }) services!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: Object, required: true }) pricing!: Record<string, number>;
  @Prop({
    enum: ['draft', 'sent', 'negotiation', 'accepted', 'rejected'],
    default: 'draft',
    index: true,
  })
  status!: string;
}

export const QuotationSchema = SchemaFactory.createForClass(Quotation);
QuotationSchema.index({ organizationId: 1, destination: 1, status: 1 });
