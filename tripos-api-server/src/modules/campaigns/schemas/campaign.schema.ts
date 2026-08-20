import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type CampaignDocument = HydratedDocument<Campaign>;

@Schema({ collection: COLLECTION_NAMES.CAMPAIGN, timestamps: true })
export class Campaign {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) name!: string;
  @Prop({ required: true, trim: true, index: true }) channel!: string;
  @Prop({ trim: true, index: true }) source?: string;
  @Prop({ trim: true, index: true }) ownerId?: string;
  @Prop({ trim: true, index: true }) campaignCode?: string;
  @Prop() startsAt?: Date;
  @Prop() endsAt?: Date;
  @Prop({ type: Object, default: {} }) audience!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) budget!: Record<string, unknown>;
  @Prop({ default: 0 }) spend!: number;
  @Prop({ default: 0 }) leads!: number;
  @Prop({ default: 0 }) quotations!: number;
  @Prop({ default: 0 }) bookings!: number;
  @Prop({ default: 0 }) revenue!: number;
  @Prop({ type: Object, default: {} }) attribution!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({
    enum: ['draft', 'active', 'paused', 'completed', 'archived'],
    default: 'draft',
    index: true,
  })
  status!: string;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
CampaignSchema.index({ organizationId: 1, channel: 1, status: 1 });
CampaignSchema.index({ organizationId: 1, campaignCode: 1 });
