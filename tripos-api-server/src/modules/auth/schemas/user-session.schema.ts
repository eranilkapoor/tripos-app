import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type UserSessionDocument = HydratedDocument<UserSession>;

@Schema({ collection: COLLECTION_NAMES.USER_SESSION, timestamps: true })
export class UserSession {
  @Prop({ required: true, unique: true, index: true }) tokenHash!: string;
  @Prop({ required: true, index: true }) userId!: string;
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ required: true, index: true }) branchId!: string;
  @Prop({ type: [String], default: [] }) scopes!: string[];
  @Prop({ trim: true, index: true }) sessionType?: string;
  @Prop({ required: true }) expiresAt!: Date;
  @Prop({ index: true }) revokedAt?: Date;
  @Prop({ type: Object, default: {} }) device!: Record<string, unknown>;
  @Prop({ trim: true }) ip?: string;
  @Prop({ trim: true }) userAgent?: string;
  @Prop() lastSeenAt?: Date;
  @Prop({ trim: true, index: true }) revokedReason?: string;
  @Prop({ type: Object, default: {} }) risk!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
UserSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
UserSessionSchema.index({ organizationId: 1, userId: 1, revokedAt: 1 });
