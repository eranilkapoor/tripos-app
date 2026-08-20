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
  @Prop({ index: true }) customerId?: string;
  @Prop({ trim: true, index: true }) bookingNo?: string;
  @Prop({ trim: true, index: true }) ownerId?: string;
  @Prop({ trim: true, index: true }) agentId?: string;
  @Prop({ trim: true, index: true }) supplierCoordinatorId?: string;
  @Prop({ trim: true, index: true }) operationsOwnerId?: string;
  @Prop({ trim: true, index: true }) financeOwnerId?: string;
  @Prop({ required: true, trim: true }) customerName!: string;
  @Prop({ required: true, trim: true, index: true }) destination!: string;
  @Prop({ trim: true }) travelDates?: string;
  @Prop() bookingDate?: Date;
  @Prop() departureDate?: Date;
  @Prop() returnDate?: Date;
  @Prop({ type: [Object], default: [] }) passengers!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) services!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) documents!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) paymentSchedule!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) vouchers!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) operationChecklist!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: Object, default: {} }) commercial!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) supplierCosting!: Record<
    string,
    unknown
  >;
  @Prop({ type: Object, default: {} }) paymentSummary!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) operationsSummary!: Record<
    string,
    unknown
  >;
  @Prop({ type: Object, default: {} }) cancellationPolicy!: Record<
    string,
    unknown
  >;
  @Prop({ type: [Object], default: [] }) statusHistory!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) supplierConfirmations!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ type: Object, default: {} }) customFields!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({
    enum: [
      'draft',
      'pending_payment',
      'confirmed',
      'partially_confirmed',
      'cancelled',
      'completed',
    ],
    default: 'draft',
    index: true,
  })
  status!: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
BookingSchema.index({ organizationId: 1, destination: 1, status: 1 });
BookingSchema.index({ organizationId: 1, bookingNo: 1 });
BookingSchema.index({ organizationId: 1, ownerId: 1, status: 1 });
