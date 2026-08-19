import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type SettingDocument = HydratedDocument<Setting>;

@Schema({ collection: COLLECTION_NAMES.SETTING, timestamps: true })
export class Setting {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) key!: string;
  @Prop({ required: true, trim: true }) label!: string;
  @Prop({ default: 'general', index: true }) category!: string;
  @Prop({ type: Object, default: {} }) value!: unknown;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({ default: 'active', index: true }) status!: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
SettingSchema.index(
  { organizationId: 1, branchId: 1, key: 1 },
  { unique: true },
);
