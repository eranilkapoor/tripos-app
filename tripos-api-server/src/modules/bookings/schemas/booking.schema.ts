import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ collection: COLLECTION_NAMES.BOOKING, timestamps: true })
export class Booking {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ index: true }) quotationId?: string;
  @Prop({ index: true }) leadId?: string;
  @Prop({ required: true, trim: true }) customerName!: string;
  @Prop({ required: true, trim: true, index: true }) destination!: string;
  @Prop({ trim: true }) travelDates?: string;
  @Prop({ type: [Object], default: [] }) passengers!: Array<Record<string, unknown>>;
  @Prop({ type: [Object], default: [] }) services!: Array<Record<string, unknown>>;
  @Prop({ type: [Object], default: [] }) documents!: Array<Record<string, unknown>>;
  @Prop({ enum: ['draft', 'pending_payment', 'confirmed', 'partially_confirmed', 'cancelled', 'completed'], default: 'draft', index: true }) status!: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
BookingSchema.index({ organizationId: 1, destination: 1, status: 1 });

