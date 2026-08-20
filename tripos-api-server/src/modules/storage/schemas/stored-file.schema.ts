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
  @Prop({ trim: true, index: true }) fileCategory?: string;
  @Prop({ required: true, trim: true }) fileName!: string;
  @Prop({ required: true, trim: true }) mimeType!: string;
  @Prop({ required: true, min: 0 }) size!: number;
  @Prop({ required: true, index: true }) storageDriver!: string;
  @Prop({ required: true }) storageKey!: string;
  @Prop() url?: string;
  @Prop() expiresAt?: Date;
  @Prop({ trim: true, index: true }) checksum?: string;
  @Prop({ trim: true, index: true }) uploadedBy?: string;
  @Prop({ trim: true, index: true }) visibility?: string;
  @Prop({ type: Object, default: {} }) retention!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) scanResult!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) accessPolicy!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) provider!: Record<string, unknown>;
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
StoredFileSchema.index({ organizationId: 1, checksum: 1 });
