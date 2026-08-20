import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type CommunicationDocument = HydratedDocument<Communication>;

@Schema({ collection: COLLECTION_NAMES.COMMUNICATION, timestamps: true })
export class Communication {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({
    enum: ['email', 'sms', 'whatsapp', 'push', 'call'],
    default: 'email',
    index: true,
  })
  channel!: string;
  @Prop({ default: 'transactional', index: true }) category!: string;
  @Prop({ trim: true, index: true }) entityType?: string;
  @Prop({ trim: true, index: true }) entityId?: string;
  @Prop({ trim: true, index: true }) recipient!: string;
  @Prop({ trim: true, index: true }) sender?: string;
  @Prop({ trim: true }) recipientName?: string;
  @Prop({ trim: true }) subject?: string;
  @Prop({ trim: true }) templateCode?: string;
  @Prop({ trim: true }) provider?: string;
  @Prop({ trim: true }) providerMessageId?: string;
  @Prop({ type: Object, default: {} }) payload!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) delivery!: Record<string, unknown>;
  @Prop({ type: [Object], default: [] }) events!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop() scheduledAt?: Date;
  @Prop() sentAt?: Date;
  @Prop() deliveredAt?: Date;
  @Prop() failedAt?: Date;
  @Prop({ trim: true }) failureReason?: string;
  @Prop({
    enum: ['draft', 'queued', 'sent', 'delivered', 'failed', 'cancelled'],
    default: 'queued',
    index: true,
  })
  status!: string;
}

export const CommunicationSchema = SchemaFactory.createForClass(Communication);
CommunicationSchema.index({
  organizationId: 1,
  branchId: 1,
  channel: 1,
  status: 1,
});
