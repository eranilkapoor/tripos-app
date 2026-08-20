import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type QuotationDocument = HydratedDocument<Quotation>;

@Schema({ collection: COLLECTION_NAMES.QUOTATION, timestamps: true })
export class Quotation {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ index: true }) leadId?: string;
  @Prop({ index: true }) customerId?: string;
  @Prop({ trim: true, index: true }) quoteNo?: string;
  @Prop({ trim: true, index: true }) ownerId?: string;
  @Prop({ trim: true, index: true }) agentId?: string;
  @Prop({ required: true, trim: true }) customerName!: string;
  @Prop({ required: true, trim: true, index: true }) destination!: string;
  @Prop({ trim: true }) travelDates?: string;
  @Prop({ default: 1 }) travellers!: number;
  @Prop({ type: [Object], default: [] }) services!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: Object, required: true }) pricing!: Record<string, number>;
  @Prop({ type: Object, default: {} }) margins!: Record<string, number>;
  @Prop({ type: Object, default: {} }) terms!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) approval!: Record<string, unknown>;
  @Prop() validUntil?: Date;
  @Prop({ default: 1 }) version!: number;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ type: Object, default: {} }) customFields!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({
    enum: ['draft', 'sent', 'negotiation', 'accepted', 'rejected'],
    default: 'draft',
    index: true,
  })
  status!: string;
}

export const QuotationSchema = SchemaFactory.createForClass(Quotation);
QuotationSchema.index({ organizationId: 1, destination: 1, status: 1 });
QuotationSchema.index({ organizationId: 1, quoteNo: 1 });
QuotationSchema.index({ organizationId: 1, ownerId: 1, status: 1 });
