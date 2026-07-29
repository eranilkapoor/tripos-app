import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type LeadDocument = HydratedDocument<Lead>;
export type LeadActivityDocument = HydratedDocument<LeadActivity>;

@Schema({ _id: false })
export class TravelRequirement {
  @Prop({ trim: true })
  destination?: string;

  @Prop({ trim: true })
  travelDate?: string;

  @Prop({ default: 1 })
  adults!: number;

  @Prop({ default: 0 })
  children!: number;

  @Prop({ trim: true })
  budget?: string;

  @Prop({ trim: true })
  duration?: string;
}

@Schema({ collection: COLLECTION_NAMES.LEAD, timestamps: true })
export class Lead {
  @Prop({ default: 'demo-org', index: true })
  organizationId!: string;

  @Prop({ default: 'main', index: true })
  branchId!: string;

  @Prop({ required: true, trim: true })
  customerName!: string;

  @Prop({ lowercase: true, trim: true, index: true })
  email?: string;

  @Prop({ trim: true, index: true })
  phone?: string;

  @Prop({ trim: true, index: true })
  source!: string;

  @Prop({ enum: ['b2c', 'b2b', 'corporate'], default: 'b2c', index: true })
  channel!: string;

  @Prop({ type: TravelRequirement, default: {} })
  requirement!: TravelRequirement;

  @Prop({ trim: true, index: true })
  assignedTo?: string;

  @Prop({
    enum: [
      'new',
      'assigned',
      'contacted',
      'requirement_collected',
      'quotation_prepared',
      'quotation_sent',
      'negotiation',
      'won',
      'lost',
      'duplicate',
    ],
    default: 'new',
    index: true,
  })
  stage!: string;

  @Prop({ enum: ['cold', 'warm', 'hot'], default: 'warm', index: true })
  temperature!: string;

  @Prop({ default: 0, min: 0, max: 100 })
  score!: number;

  @Prop()
  nextFollowUpAt?: Date;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, unknown>;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
LeadSchema.index({ organizationId: 1, phone: 1 });
LeadSchema.index({ organizationId: 1, email: 1 });
LeadSchema.index({ organizationId: 1, stage: 1, createdAt: -1 });
LeadSchema.index({ organizationId: 1, assignedTo: 1, nextFollowUpAt: 1 });
LeadSchema.index({ organizationId: 1, 'requirement.destination': 1 });

@Schema({ collection: COLLECTION_NAMES.LEAD_ACTIVITY, timestamps: true })
export class LeadActivity {
  @Prop({ default: 'demo-org', index: true })
  organizationId!: string;

  @Prop({ required: true, index: true })
  leadId!: string;

  @Prop({
    enum: [
      'lead_created',
      'assignment_changed',
      'stage_changed',
      'note_added',
      'quotation_created',
      'payment_received',
    ],
    required: true,
  })
  type!: string;

  @Prop({ trim: true })
  subject?: string;

  @Prop()
  description?: string;

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, unknown>;
}

export const LeadActivitySchema = SchemaFactory.createForClass(LeadActivity);
LeadActivitySchema.index({ organizationId: 1, leadId: 1, createdAt: -1 });

