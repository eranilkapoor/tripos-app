import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type B2BAgentDocument = HydratedDocument<B2BAgent>;

@Schema({ collection: COLLECTION_NAMES.B2B_AGENT, timestamps: true })
export class B2BAgent {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) agencyName!: string;
  @Prop({ trim: true, index: true }) agentCode?: string;
  @Prop({ trim: true, index: true }) ownerId?: string;
  @Prop({ trim: true }) contactName?: string;
  @Prop({ lowercase: true, trim: true, index: true }) email?: string;
  @Prop({ trim: true, index: true }) phone?: string;
  @Prop({ trim: true, index: true }) market?: string;
  @Prop({ trim: true, index: true }) agentType?: string;
  @Prop({ trim: true, index: true }) territory?: string;
  @Prop({ trim: true, index: true }) preferredCurrency?: string;
  @Prop({ default: 0 }) creditLimit!: number;
  @Prop({ default: 0 }) availableCredit!: number;
  @Prop({ default: 0 }) receivable!: number;
  @Prop({ default: 0 }) commissionEarned!: number;
  @Prop({ default: 0 }) walletBalance!: number;
  @Prop({ type: [Object], default: [] }) kycDocuments!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) walletLedger!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) commissionLedger!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) invoices!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: Object, default: {} }) taxProfile!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) bankDetails!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) contractTerms!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) creditPolicy!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) pricingPolicy!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) portalAccess!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) performance!: Record<string, unknown>;
  @Prop() onboardedAt?: Date;
  @Prop() lastBookingAt?: Date;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ type: Object, default: {} }) customFields!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({
    enum: ['pending_kyc', 'active', 'suspended', 'blocked'],
    default: 'pending_kyc',
    index: true,
  })
  status!: string;
}

export const B2BAgentSchema = SchemaFactory.createForClass(B2BAgent);
B2BAgentSchema.index({ organizationId: 1, market: 1, status: 1 });
B2BAgentSchema.index({ organizationId: 1, agentCode: 1 });
