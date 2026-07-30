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
  @Prop({ required: true }) expiresAt!: Date;
  @Prop({ index: true }) revokedAt?: Date;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
UserSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
