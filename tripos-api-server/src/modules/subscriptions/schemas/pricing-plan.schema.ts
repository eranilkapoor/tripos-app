import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type PricingPlanDocument = HydratedDocument<PricingPlan>;

@Schema({
  timestamps: true,
  collection: COLLECTION_NAMES.PRICING_PLAN,
})
export class PricingPlan {
  @Prop({ required: true, unique: true, trim: true }) code!: string;
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ trim: true }) description?: string;
  @Prop({ default: 'b2b_crm' }) audience!: string;
  @Prop({ default: 'monthly' }) billingCycle!: string;
  @Prop({ default: 'INR' }) currencyCode!: string;
  @Prop({ default: 0 }) priceMinor!: number;
  @Prop({ default: 0 }) setupFeeMinor!: number;
  @Prop({ default: 0 }) trialDays!: number;
  @Prop({ default: 1 }) minSeats!: number;
  @Prop({ default: 25 }) includedSeats!: number;
  @Prop({ default: 0 }) extraSeatPriceMinor!: number;
  @Prop({ type: [String], default: [] }) features!: string[];
  @Prop({ type: Object, default: {} }) limits!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) providerPrices!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) terms!: Record<string, unknown>;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ default: 'active' }) status!: string;
}

export const PricingPlanSchema = SchemaFactory.createForClass(PricingPlan);
PricingPlanSchema.index({ status: 1, audience: 1, priceMinor: 1 });
