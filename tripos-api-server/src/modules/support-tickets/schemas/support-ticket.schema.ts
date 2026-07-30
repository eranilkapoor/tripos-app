import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type SupportTicketDocument = HydratedDocument<SupportTicket>;

@Schema({ collection: COLLECTION_NAMES.SUPPORT_TICKET, timestamps: true })
export class SupportTicket {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) subject!: string;
  @Prop({ required: true, trim: true, index: true }) customerName!: string;
  @Prop({ index: true }) bookingId?: string;
  @Prop({ trim: true, index: true }) channel?: string;
  @Prop({
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true,
  })
  priority!: string;
  @Prop({ trim: true, index: true }) assignedTo?: string;
  @Prop({ trim: true }) description?: string;
  @Prop({
    enum: ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'],
    default: 'open',
    index: true,
  })
  status!: string;
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);
SupportTicketSchema.index({ organizationId: 1, status: 1, priority: 1 });
