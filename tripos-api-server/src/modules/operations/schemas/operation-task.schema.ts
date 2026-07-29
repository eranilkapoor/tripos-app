import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type OperationTaskDocument = HydratedDocument<OperationTask>;

@Schema({ collection: COLLECTION_NAMES.OPERATION_TASK, timestamps: true })
export class OperationTask {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ index: true }) bookingId?: string;
  @Prop({ required: true, trim: true }) title!: string;
  @Prop({ required: true, trim: true, index: true }) serviceType!: string;
  @Prop({ trim: true, index: true }) supplierId?: string;
  @Prop({ trim: true }) assignedTo?: string;
  @Prop() dueAt?: Date;
  @Prop({ type: Object, default: {} }) payload!: Record<string, unknown>;
  @Prop({ default: 'medium', index: true }) priority!: string;
  @Prop({ default: 'on_track', index: true }) slaStatus!: string;
  @Prop({ type: [Object], default: [] }) timeline!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) escalations!: Array<
    Record<string, unknown>
  >;
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
