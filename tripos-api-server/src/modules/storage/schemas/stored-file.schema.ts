import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type StoredFileDocument = HydratedDocument<StoredFile>;

@Schema({ collection: COLLECTION_NAMES.STORED_FILE, timestamps: true })
export class StoredFile {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, index: true }) entityType!: string;
  @Prop({ required: true, index: true }) entityId!: string;
  @Prop({ required: true, trim: true }) fileName!: string;
  @Prop({ required: true, trim: true }) mimeType!: string;
  @Prop({ required: true, min: 0 }) size!: number;
  @Prop({ required: true, index: true }) storageDriver!: string;
  @Prop({ required: true }) storageKey!: string;
  @Prop() url?: string;
  @Prop({
    enum: ['pending_upload', 'available', 'archived'],
    default: 'pending_upload',
    index: true,
  })
  status!: string;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
}

export const StoredFileSchema = SchemaFactory.createForClass(StoredFile);
StoredFileSchema.index({
  organizationId: 1,
  entityType: 1,
  entityId: 1,
  createdAt: -1,
});
