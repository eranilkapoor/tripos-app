import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ collection: COLLECTION_NAMES.NOTIFICATION, timestamps: true })
export class Notification {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) title!: string;
  @Prop({ trim: true }) message?: string;
  @Prop({
    enum: ['system', 'sales', 'operations', 'finance', 'support'],
    default: 'system',
    index: true,
  })
  type!: string;
  @Prop({
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true,
  })
  priority!: string;
  @Prop({
    enum: ['organization', 'branch', 'user', 'agent', 'customer'],
    default: 'organization',
    index: true,
  })
  audience!: string;
  @Prop({ trim: true, index: true }) module?: string;
  @Prop({ trim: true, index: true }) recordId?: string;
  @Prop({ trim: true, index: true }) assignedTo?: string;
  @Prop({
    enum: ['unread', 'read', 'archived'],
    default: 'unread',
    index: true,
  })
  status!: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({
  organizationId: 1,
  branchId: 1,
  status: 1,
  priority: 1,
});
