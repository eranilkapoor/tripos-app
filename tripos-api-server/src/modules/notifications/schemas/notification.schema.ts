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
  @Prop({ trim: true, index: true }) entityType?: string;
  @Prop({ trim: true, index: true }) entityId?: string;
  @Prop({ trim: true, index: true }) assignedTo?: string;
  @Prop({ trim: true, index: true }) userId?: string;
  @Prop({ trim: true, index: true }) agentId?: string;
  @Prop({ trim: true, index: true }) customerId?: string;
  @Prop({ trim: true, index: true }) actionUrl?: string;
  @Prop({ trim: true }) icon?: string;
  @Prop({ type: Object, default: {} }) delivery!: Record<string, unknown>;
  @Prop() scheduledAt?: Date;
  @Prop() readAt?: Date;
  @Prop() archivedAt?: Date;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
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
