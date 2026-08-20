import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ collection: COLLECTION_NAMES.TASK, timestamps: true })
export class Task {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true }) title!: string;
  @Prop({ default: '' }) description!: string;
  @Prop({ default: 'general', index: true }) module!: string;
  @Prop({ default: '', index: true }) entityId!: string;
  @Prop({ default: '', index: true }) entityType!: string;
  @Prop({ default: '', index: true }) assignedTo!: string;
  @Prop({ trim: true, index: true }) ownerId?: string;
  @Prop({ trim: true, index: true }) departmentId?: string;
  @Prop({ trim: true, index: true }) teamId?: string;
  @Prop({
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true,
  })
  priority!: string;
  @Prop({ index: true }) dueAt?: Date;
  @Prop() startedAt?: Date;
  @Prop() completedAt?: Date;
  @Prop({ type: [Object], default: [] }) checklist!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) comments!: Array<
    Record<string, unknown>
  >;
  @Prop({
    enum: ['open', 'in_progress', 'waiting', 'completed', 'cancelled'],
    default: 'open',
    index: true,
  })
  status!: string;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.index({ organizationId: 1, branchId: 1, status: 1, dueAt: 1 });
TaskSchema.index({ organizationId: 1, module: 1, entityId: 1 });
