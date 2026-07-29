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
  @Prop({
    required: true,
    enum: ['receivable', 'payable', 'refund', 'commission'],
    index: true,
  })
  type!: string;
  @Prop({ required: true }) amount!: number;
  @Prop({ default: 'INR' }) currencyCode!: string;
  @Prop({ trim: true }) partyName?: string;
  @Prop({ trim: true }) dueDate?: string;
  @Prop({ trim: true }) paidAt?: string;
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
