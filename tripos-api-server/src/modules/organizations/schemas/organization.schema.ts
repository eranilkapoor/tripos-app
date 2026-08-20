import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type OrganizationDocument = HydratedDocument<Organization>;

@Schema({ collection: COLLECTION_NAMES.ORGANIZATION, timestamps: true })
export class Organization {
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ trim: true, index: true }) legalName?: string;
  @Prop({ trim: true, index: true }) organizationType?: string;
  @Prop({ trim: true }) industry?: string;
  @Prop({ trim: true }) website?: string;
  @Prop({ trim: true }) primaryEmail?: string;
  @Prop({ trim: true }) primaryPhone?: string;
  @Prop({ trim: true }) timezone?: string;
  @Prop({ trim: true }) locale?: string;
  @Prop({ trim: true }) baseCurrency?: string;
  @Prop({
    required: true,
    trim: true,
    uppercase: true,
    unique: true,
    index: true,
  })
  code!: string;
  @Prop({
    enum: ['tripos_cloud', 'customer_managed', 'hybrid_sync'],
    default: 'tripos_cloud',
    index: true,
  })
  dataHostingMode!: string;
  @Prop({
    type: [Object],
    default: [{ id: 'main', name: 'Main Branch', city: 'Delhi' }],
  })
  branches!: Array<Record<string, unknown>>;
  @Prop({
    type: Object,
    default: { syncMode: 'realtime', offlineWindowHours: 24 },
  })
  syncPolicy!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) billingProfile!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) address!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) contacts!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) subscription!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) commercial!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) branding!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) compliance!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) securityPolicy!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) integrations!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) notificationPolicy!: Record<
    string,
    unknown
  >;
  @Prop({ type: Object, default: {} }) retentionPolicy!: Record<
    string,
    unknown
  >;
  @Prop({ type: Object, default: {} }) auditPolicy!: Record<string, unknown>;
  @Prop() onboardedAt?: Date;
  @Prop() trialEndsAt?: Date;
  @Prop() suspendedAt?: Date;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    index: true,
  })
  status!: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
OrganizationSchema.index({ status: 1, code: 1 });
