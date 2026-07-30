import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type TravelDocumentDocument = HydratedDocument<TravelDocument>;

@Schema({ collection: COLLECTION_NAMES.TRAVEL_DOCUMENT, timestamps: true })
export class TravelDocument {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) customerName!: string;
  @Prop({ index: true }) bookingId?: string;
  @Prop({ required: true, trim: true, index: true }) documentType!: string;
  @Prop({ trim: true, index: true }) documentNumber?: string;
  @Prop({ trim: true }) expiryDate?: string;
  @Prop({ trim: true }) fileUrl?: string;
  @Prop({ trim: true }) notes?: string;
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
