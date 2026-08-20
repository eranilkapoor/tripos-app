import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type TravelDocumentDocument = HydratedDocument<TravelDocument>;

@Schema({ collection: COLLECTION_NAMES.TRAVEL_DOCUMENT, timestamps: true })
export class TravelDocument {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ index: true }) customerId?: string;
  @Prop({ required: true, trim: true, index: true }) customerName!: string;
  @Prop({ index: true }) bookingId?: string;
  @Prop({ required: true, trim: true, index: true }) documentType!: string;
  @Prop({ trim: true, index: true }) documentNumber?: string;
  @Prop({ trim: true }) expiryDate?: string;
  @Prop({ trim: true }) fileUrl?: string;
  @Prop({ trim: true }) notes?: string;
  @Prop({ trim: true, index: true }) fileId?: string;
  @Prop({ trim: true, index: true }) issuingCountry?: string;
  @Prop() issueDate?: string;
  @Prop() verifiedAt?: Date;
  @Prop({ trim: true }) verifiedBy?: string;
  @Prop({ type: Object, default: {} }) compliance!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({
    enum: ['pending', 'received', 'verified', 'expired', 'rejected'],
    default: 'pending',
    index: true,
  })
  status!: string;
}

export const TravelDocumentSchema =
  SchemaFactory.createForClass(TravelDocument);
TravelDocumentSchema.index({ organizationId: 1, bookingId: 1, status: 1 });
TravelDocumentSchema.index({
  organizationId: 1,
  customerId: 1,
  documentType: 1,
});
