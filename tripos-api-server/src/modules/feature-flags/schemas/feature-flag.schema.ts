import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type FeatureFlagDocument = HydratedDocument<FeatureFlag>;

@Schema({ collection: COLLECTION_NAMES.FEATURE_FLAG, timestamps: true })
export class FeatureFlag {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) key!: string;
  @Prop({ required: true, trim: true }) label!: string;
  @Prop({ default: 'platform', index: true }) category!: string;
  @Prop({ default: false }) enabled!: boolean;
  @Prop({ trim: true }) ownerId?: string;
  @Prop({ type: Object, default: {} }) rollout!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) rules!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) audit!: Record<string, unknown>;
  @Prop() startsAt?: Date;
  @Prop() endsAt?: Date;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({
    enum: ['active', 'inactive', 'archived'],
    default: 'active',
    index: true,
  })
  status!: string;
}

export const FeatureFlagSchema = SchemaFactory.createForClass(FeatureFlag);
FeatureFlagSchema.index(
  { organizationId: 1, branchId: 1, key: 1 },
  { unique: true },
);
