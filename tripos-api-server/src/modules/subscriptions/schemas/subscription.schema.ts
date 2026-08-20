import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({
  timestamps: true,
  collection: COLLECTION_NAMES.SUBSCRIPTION,
})
export class Subscription {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ default: '', index: true }) branchId!: string;
  @Prop({ required: true, index: true }) planCode!: string;
  @Prop({ required: true }) planName!: string;
  @Prop({ default: 'b2b_crm' }) audience!: string;
  @Prop({ default: 'monthly' }) billingCycle!: string;
  @Prop({ default: 'INR' }) currencyCode!: string;
  @Prop({ default: 0 }) amountMinor!: number;
  @Prop({ default: 0 }) setupFeeMinor!: number;
  @Prop({ default: 1 }) seats!: number;
  @Prop({ default: 0 }) trialDays!: number;
  @Prop({ type: Date }) trialEndsAt?: Date;
  @Prop({ type: Date }) startsAt?: Date;
  @Prop({ type: Date }) renewsAt?: Date;
  @Prop({ type: Date }) graceEndsAt?: Date;
  @Prop({ type: Date }) cancelledAt?: Date;
  @Prop({ trim: true }) cancellationReason?: string;
  @Prop({ default: 'sandbox' }) paymentProvider!: string;
  @Prop({ trim: true }) providerCustomerId?: string;
  @Prop({ trim: true }) providerSubscriptionId?: string;
  @Prop({ trim: true }) checkoutReference?: string;
  @Prop({ type: Object, default: {} }) paymentMethod!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) billingProfile!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) usage!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) limitsSnapshot!: Record<string, unknown>;
  @Prop({ type: [String], default: [] }) featuresSnapshot!: string[];
  @Prop({ type: [Object], default: [] }) invoices!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({ default: 'pending' }) status!: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
SubscriptionSchema.index({ organizationId: 1, status: 1, updatedAt: -1 });
SubscriptionSchema.index({ organizationId: 1, planCode: 1, status: 1 });
