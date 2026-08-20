import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type ImportExportJobDocument = HydratedDocument<ImportExportJob>;

@Schema({ collection: COLLECTION_NAMES.IMPORT_EXPORT_JOB, timestamps: true })
export class ImportExportJob {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ enum: ['import', 'export'], default: 'import', index: true })
  jobType!: string;
  @Prop({ required: true, trim: true, index: true }) module!: string;
  @Prop({ trim: true }) fileName?: string;
  @Prop({ trim: true }) format?: string;
  @Prop({ default: 0 }) totalRows!: number;
  @Prop({ default: 0 }) successRows!: number;
  @Prop({ default: 0 }) failedRows!: number;
  @Prop({ trim: true }) requestedBy?: string;
  @Prop({ type: [Object], default: [] }) errorRows!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop() startedAt?: Date;
  @Prop() completedAt?: Date;
  @Prop({
    enum: ['queued', 'running', 'completed', 'failed', 'cancelled'],
    default: 'queued',
    index: true,
  })
  status!: string;
}

export const ImportExportJobSchema =
  SchemaFactory.createForClass(ImportExportJob);
ImportExportJobSchema.index({
  organizationId: 1,
  branchId: 1,
  module: 1,
  status: 1,
});
