import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type SavedReportDocument = HydratedDocument<SavedReport>;

@Schema({ collection: COLLECTION_NAMES.SAVED_REPORT, timestamps: true })
export class SavedReport {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, trim: true, index: true }) reportType!: string;
  @Prop({ type: Object, default: {} }) filters!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) schedule!: Record<string, unknown>;
  @Prop({ type: [String], default: [] }) recipients!: string[];
  @Prop({ trim: true, index: true }) ownerId?: string;
  @Prop({ type: Object, default: {} }) delivery!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) permissions!: Record<string, unknown>;
  @Prop({
    enum: ['active', 'paused', 'archived'],
    default: 'active',
    index: true,
  })
  status!: string;
  @Prop() lastRunAt?: Date;
  @Prop() nextRunAt?: Date;
  @Prop({ type: Object, default: {} }) lastRunResult!: Record<string, unknown>;
}

export const SavedReportSchema = SchemaFactory.createForClass(SavedReport);
SavedReportSchema.index({ organizationId: 1, reportType: 1, status: 1 });
SavedReportSchema.index({ organizationId: 1, ownerId: 1, status: 1 });
SavedReportSchema.index({
  organizationId: 1,
  branchId: 1,
  status: 1,
  nextRunAt: 1,
});
