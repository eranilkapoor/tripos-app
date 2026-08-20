import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type OperatingRecordDocument = HydratedDocument<OperatingRecord>;

@Schema({ collection: COLLECTION_NAMES.OPERATING_RECORD, timestamps: true })
export class OperatingRecord {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) moduleKey!: string;
  @Prop({ required: true, trim: true, index: true }) title!: string;
  @Prop({ trim: true, index: true }) code?: string;
  @Prop({ trim: true, index: true }) category?: string;
  @Prop({ trim: true, index: true }) entityType?: string;
  @Prop({ trim: true, index: true }) entityId?: string;
  @Prop({ trim: true, index: true }) ownerId?: string;
  @Prop({ trim: true, index: true }) assignedTo?: string;
  @Prop({ trim: true, index: true }) departmentId?: string;
  @Prop({ trim: true, index: true }) teamId?: string;
  @Prop({ trim: true, index: true }) channel?: string;
  @Prop({ trim: true, index: true }) priority?: string;
  @Prop({ trim: true }) description?: string;
  @Prop() dueAt?: Date;
  @Prop() scheduledAt?: Date;
  @Prop() startedAt?: Date;
  @Prop() completedAt?: Date;
  @Prop({ type: [Object], default: [] }) timeline!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) attachments!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: Object, default: {} }) details!: Record<string, unknown>;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({ default: 'active', index: true }) status!: string;
}

export const OperatingRecordSchema =
  SchemaFactory.createForClass(OperatingRecord);
OperatingRecordSchema.index({
  organizationId: 1,
  branchId: 1,
  moduleKey: 1,
  status: 1,
});
