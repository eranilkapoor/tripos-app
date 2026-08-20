import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ collection: COLLECTION_NAMES.PAYMENT, timestamps: true })
export class Payment {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ index: true }) bookingId?: string;
  @Prop({ index: true }) agentId?: string;
  @Prop({ index: true }) customerId?: string;
  @Prop({ index: true }) invoiceId?: string;
  @Prop({ trim: true, index: true }) paymentNo?: string;
  @Prop({ trim: true, index: true }) supplierId?: string;
  @Prop({
    required: true,
    enum: ['receivable', 'payable', 'refund', 'commission'],
    index: true,
  })
  type!: string;
  @Prop({ required: true }) amount!: number;
  @Prop({ required: true, index: true }) amountMinor!: number;
  @Prop({ default: 'INR' }) currencyCode!: string;
  @Prop({ trim: true }) partyName?: string;
  @Prop({ trim: true, index: true }) partyType?: string;
  @Prop({ trim: true, index: true }) partyId?: string;
  @Prop({ trim: true }) dueDate?: string;
  @Prop({ trim: true }) paidAt?: string;
  @Prop({ trim: true }) receivedBy?: string;
  @Prop({ trim: true }) approvedBy?: string;
  @Prop({ trim: true, index: true }) paymentMode?: string;
  @Prop({ trim: true, index: true }) gatewayProvider?: string;
  @Prop({ trim: true, index: true }) gatewayReference?: string;
  @Prop({ trim: true, index: true }) bankReference?: string;
  @Prop({ type: Object, default: {} }) reconciliation!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) taxBreakup!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) gatewayPayload!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) receipt!: Record<string, unknown>;
  @Prop({ type: [Object], default: [] }) adjustments!: Array<
    Record<string, unknown>
  >;
  @Prop({
    enum: ['pending', 'paid', 'partially_paid', 'overdue', 'cancelled'],
    default: 'pending',
    index: true,
  })
  status!: string;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.index({ organizationId: 1, type: 1, status: 1, dueDate: 1 });
PaymentSchema.index({ organizationId: 1, paymentNo: 1 });
PaymentSchema.index({ organizationId: 1, gatewayReference: 1 });
