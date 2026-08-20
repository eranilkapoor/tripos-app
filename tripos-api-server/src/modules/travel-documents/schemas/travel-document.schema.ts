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
  @Prop({ trim: true, index: true }) passengerId?: string;
  @Prop({ trim: true, index: true }) travellerName?: string;
  @Prop({ required: true, trim: true, index: true }) documentType!: string;
  @Prop({ trim: true, index: true }) documentNumber?: string;
  @Prop({ trim: true }) expiryDate?: string;
  @Prop({ trim: true }) fileUrl?: string;
  @Prop({ trim: true }) notes?: string;
  @Prop({ trim: true, index: true }) fileId?: string;
  @Prop({ trim: true, index: true }) issuingCountry?: string;
  @Prop({ trim: true, index: true }) nationality?: string;
  @Prop() issueDate?: string;
  @Prop() verifiedAt?: Date;
  @Prop({ trim: true }) verifiedBy?: string;
  @Prop({ trim: true }) rejectionReason?: string;
  @Prop({ trim: true }) reminderStatus?: string;
  @Prop() requestedAt?: Date;
  @Prop() receivedAt?: Date;
  @Prop() reminderDueAt?: Date;
  @Prop({ type: [Object], default: [] }) verificationHistory!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: Object, default: {} }) compliance!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) security!: Record<string, unknown>;
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
