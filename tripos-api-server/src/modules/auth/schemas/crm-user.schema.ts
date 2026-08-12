import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type CrmUserDocument = HydratedDocument<CrmUser>;

@Schema({ collection: COLLECTION_NAMES.CRM_USER, timestamps: true })
export class CrmUser {
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email!: string;
  @Prop({ required: true }) passwordHash!: string;
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ type: [String], default: [] }) branchIds!: string[];
  @Prop({ type: [String], default: [] }) departmentIds!: string[];
  @Prop({ type: [String], default: [] }) teamIds!: string[];
  @Prop({
    enum: [
      'platform_admin',
      'organization_admin',
      'branch_manager',
      'sales',
      'operations',
      'finance',
      'agent',
    ],
    default: 'organization_admin',
    index: true,
  })
  role!: string;
  @Prop({ type: [String], default: [] }) permissions!: string[];
  @Prop({
    enum: ['active', 'inactive', 'locked', 'invited'],
    default: 'active',
    index: true,
  })
  status!: string;
  @Prop({ index: true }) resetTokenHash?: string;
  @Prop() resetTokenExpiresAt?: Date;
  @Prop({ index: true }) invitationTokenHash?: string;
  @Prop() invitationExpiresAt?: Date;
}

export const CrmUserSchema = SchemaFactory.createForClass(CrmUser);

CrmUserSchema.index({ organizationId: 1, email: 1 }, { unique: true });
