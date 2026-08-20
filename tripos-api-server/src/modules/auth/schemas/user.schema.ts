import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: COLLECTION_NAMES.USER, timestamps: true })
export class User {
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email!: string;
  @Prop({ trim: true }) phone?: string;
  @Prop({ default: 'Asia/Kolkata' }) timezone!: string;
  @Prop({ default: 'en' }) locale!: string;
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
  @Prop({ trim: true, index: true }) employeeCode?: string;
  @Prop({ trim: true, index: true }) managerUserId?: string;
  @Prop({ type: Object, default: {} }) profile!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) preferences!: Record<string, unknown>;
  @Prop({ type: Object, default: {} })
  notificationPreferences!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) security!: Record<string, unknown>;
  @Prop() lastLoginAt?: Date;
  @Prop() passwordChangedAt?: Date;
  @Prop({ default: 0 }) failedLoginAttempts!: number;
  @Prop() lockedUntil?: Date;
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

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ organizationId: 1, email: 1 }, { unique: true });
UserSchema.index({ organizationId: 1, role: 1, status: 1 });
UserSchema.index({ organizationId: 1, employeeCode: 1 });
