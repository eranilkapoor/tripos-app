import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type TagDocument = HydratedDocument<Tag>;

@Schema({ collection: COLLECTION_NAMES.TAG, timestamps: true })
export class Tag {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) name!: string;
  @Prop({ default: '#2563eb' }) color!: string;
  @Prop({ default: 'general', index: true }) module!: string;
  @Prop({ default: '', index: true }) entityType!: string;
  @Prop({ default: 0 }) usageCount!: number;
  @Prop({ default: '' }) description!: string;
  @Prop({ type: Object, default: {} }) rules!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({ default: 'active', index: true }) status!: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
TagSchema.index(
  { organizationId: 1, branchId: 1, module: 1, name: 1 },
  { unique: true },
);
