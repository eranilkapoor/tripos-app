import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type VoucherDocument = HydratedDocument<Voucher>;

@Schema({ collection: COLLECTION_NAMES.VOUCHER, timestamps: true })
export class Voucher {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) bookingId!: string;
  @Prop({ index: true }) customerId?: string;
  @Prop({ required: true, trim: true, index: true }) customerName!: string;
  @Prop({ required: true, trim: true, index: true }) voucherType!: string;
  @Prop({ trim: true, index: true }) voucherNo?: string;
  @Prop({ trim: true, index: true }) serviceType?: string;
  @Prop({ trim: true, index: true }) supplierName?: string;
  @Prop({ trim: true, index: true }) supplierId?: string;
  @Prop({ trim: true }) issueDate?: string;
  @Prop({ trim: true }) serviceDate?: string;
  @Prop({ trim: true }) serviceTime?: string;
  @Prop({ trim: true }) destination?: string;
  @Prop({ trim: true, index: true }) confirmationNumber?: string;
  @Prop({ trim: true, index: true }) fileId?: string;
  @Prop({ trim: true }) fileUrl?: string;
  @Prop({ type: [Object], default: [] }) lineItems!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: Object, default: {} }) supplierConfirmation!: Record<
    string,
    unknown
  >;
  @Prop({ type: Object, default: {} }) travellerInstructions!: Record<
    string,
    unknown
  >;
  @Prop({
    enum: ['draft', 'issued', 'sent', 'cancelled'],
    default: 'draft',
    index: true,
  })
  status!: string;
  @Prop({ type: Object, default: {} }) delivery!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) cancellationPolicy!: Record<
    string,
    unknown
  >;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
VoucherSchema.index({ organizationId: 1, bookingId: 1, voucherType: 1 });
VoucherSchema.index({ organizationId: 1, voucherNo: 1 });
