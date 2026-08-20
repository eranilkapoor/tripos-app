import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type OperationTaskDocument = HydratedDocument<OperationTask>;

@Schema({ collection: COLLECTION_NAMES.OPERATION_TASK, timestamps: true })
export class OperationTask {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ index: true }) bookingId?: string;
  @Prop({ index: true }) customerId?: string;
  @Prop({ required: true, trim: true }) title!: string;
  @Prop({ required: true, trim: true, index: true }) serviceType!: string;
  @Prop({ trim: true, index: true }) supplierId?: string;
  @Prop({ trim: true, index: true }) voucherId?: string;
  @Prop({ trim: true, index: true }) departmentId?: string;
  @Prop({ trim: true }) assignedTo?: string;
  @Prop({ trim: true, index: true }) ownerId?: string;
  @Prop({ trim: true, index: true }) teamId?: string;
  @Prop() dueAt?: Date;
  @Prop() startedAt?: Date;
  @Prop() completedAt?: Date;
  @Prop() confirmedAt?: Date;
  @Prop({ trim: true }) location?: string;
  @Prop({ type: Object, default: {} }) payload!: Record<string, unknown>;
  @Prop({ default: 'medium', index: true }) priority!: string;
  @Prop({ default: 'on_track', index: true }) slaStatus!: string;
  @Prop({ type: [Object], default: [] }) timeline!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) escalations!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) dependencies!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: Object, default: {} }) qualityCheck!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) supplierConfirmation!: Record<
    string,
    unknown
  >;
  @Prop({ type: Object, default: {} }) checklist!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) fieldUpdate!: Record<string, unknown>;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ type: Object, default: {} }) customFields!: Record<string, unknown>;
  @Prop({
    enum: [
      'pending',
      'assigned',
      'confirmed',
      'in_progress',
      'completed',
      'issue',
    ],
    default: 'pending',
    index: true,
  })
  status!: string;
}

export const OperationTaskSchema = SchemaFactory.createForClass(OperationTask);
OperationTaskSchema.index({ organizationId: 1, bookingId: 1, status: 1 });
OperationTaskSchema.index({ organizationId: 1, ownerId: 1, dueAt: 1 });
