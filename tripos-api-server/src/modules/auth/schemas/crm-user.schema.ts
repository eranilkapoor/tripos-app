import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type CrmUserDocument = HydratedDocument<CrmUser>;

@Schema({ collection: COLLECTION_NAMES.CRM_USER, timestamps: true })
export class CrmUser {
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, lowercase: true, trim: true, unique: true, index: true }) email!: string;
  @Prop({ required: true }) passwordHash!: string;
  @Prop({ required: true, index: true }) tenantId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ enum: ['platform_admin', 'tenant_admin', 'branch_manager', 'sales', 'operations', 'finance', 'agent'], default: 'tenant_admin', index: true }) role!: string;
  @Prop({ type: [String], default: [] }) permissions!: string[];
  @Prop({ enum: ['active', 'inactive', 'locked'], default: 'active', index: true }) status!: string;
}

export const CrmUserSchema = SchemaFactory.createForClass(CrmUser);
