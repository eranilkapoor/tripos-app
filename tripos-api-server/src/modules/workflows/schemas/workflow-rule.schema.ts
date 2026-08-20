import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type WorkflowRuleDocument = HydratedDocument<WorkflowRule>;

@Schema({ collection: COLLECTION_NAMES.WORKFLOW_RULE, timestamps: true })
export class WorkflowRule {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) name!: string;
  @Prop({ required: true, trim: true, index: true }) code!: string;
  @Prop({ default: 'operations', index: true }) module!: string;
  @Prop({ default: 'record_status_changed', index: true }) trigger!: string;
  @Prop({ trim: true, index: true }) entityType?: string;
  @Prop({ type: Object, default: {} }) conditions!: Record<string, unknown>;
  @Prop({ type: [Object], default: [] }) actions!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: Object, default: {} }) schedule!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) throttling!: Record<string, unknown>;
  @Prop({ default: 100 }) priority!: number;
  @Prop({ default: false }) runOnce!: boolean;
  @Prop() lastRunAt?: Date;
  @Prop() nextRunAt?: Date;
  @Prop({ type: Object, default: {} }) lastRunResult!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({
    enum: ['active', 'inactive', 'paused'],
    default: 'active',
    index: true,
  })
  status!: string;
}

export const WorkflowRuleSchema = SchemaFactory.createForClass(WorkflowRule);
WorkflowRuleSchema.index(
  { organizationId: 1, branchId: 1, code: 1 },
  { unique: true },
);
