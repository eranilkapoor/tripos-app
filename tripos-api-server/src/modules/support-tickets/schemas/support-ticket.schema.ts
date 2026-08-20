import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type SupportTicketDocument = HydratedDocument<SupportTicket>;

@Schema({ collection: COLLECTION_NAMES.SUPPORT_TICKET, timestamps: true })
export class SupportTicket {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) subject!: string;
  @Prop({ trim: true, index: true }) ticketNo?: string;
  @Prop({ index: true }) customerId?: string;
  @Prop({ required: true, trim: true, index: true }) customerName!: string;
  @Prop({ index: true }) bookingId?: string;
  @Prop({ trim: true, index: true }) agentId?: string;
  @Prop({ trim: true, index: true }) supplierId?: string;
  @Prop({ trim: true, index: true }) channel?: string;
  @Prop({ trim: true, index: true }) source?: string;
  @Prop({
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true,
  })
  priority!: string;
  @Prop({ trim: true, index: true }) assignedTo?: string;
  @Prop({ trim: true, index: true }) ownerId?: string;
  @Prop({ trim: true, index: true }) category?: string;
  @Prop({ trim: true, index: true }) subCategory?: string;
  @Prop({ trim: true, index: true }) departmentId?: string;
  @Prop({ trim: true, index: true }) teamId?: string;
  @Prop({ trim: true }) description?: string;
  @Prop() firstResponseDueAt?: Date;
  @Prop() firstRespondedAt?: Date;
  @Prop() resolutionDueAt?: Date;
  @Prop() resolvedAt?: Date;
  @Prop() closedAt?: Date;
  @Prop({ trim: true }) resolutionSummary?: string;
  @Prop({ trim: true }) rootCause?: string;
  @Prop({ type: Object, default: {} }) sla!: Record<string, unknown>;
  @Prop({ type: [Object], default: [] }) escalations!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) messages!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ type: Object, default: {} }) satisfaction!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) attachments!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({
    enum: ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'],
    default: 'open',
    index: true,
  })
  status!: string;
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);
SupportTicketSchema.index({ organizationId: 1, status: 1, priority: 1 });
SupportTicketSchema.index({ organizationId: 1, ticketNo: 1 });
