import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type DestinationDocument = HydratedDocument<Destination>;

@Schema({ collection: COLLECTION_NAMES.DESTINATION, timestamps: true })
export class Destination {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ required: true, trim: true, index: true }) name!: string;
  @Prop({ required: true, trim: true, index: true }) country!: string;
  @Prop({ trim: true }) region?: string;
  @Prop({ trim: true }) cityCode?: string;
  @Prop({ trim: true }) countryCode?: string;
  @Prop({ trim: true }) timezone?: string;
  @Prop({ trim: true }) bestSeason?: string;
  @Prop({ trim: true }) idealDuration?: string;
  @Prop({ trim: true }) popularityTier?: string;
  @Prop({ type: [String], default: [] }) highlights!: string[];
  @Prop({ type: [String], default: [] }) themes!: string[];
  @Prop({ type: [String], default: [] }) images!: string[];
  @Prop({ trim: true }) visaRequirement?: string;
  @Prop({ type: Object, default: {} }) weather!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) currency!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) airport!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) geo!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) content!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) travelAdvisory!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) seo!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) publishing!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) supplierCoverage!: Record<
    string,
    unknown
  >;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ enum: ['active', 'inactive'], default: 'active', index: true })
  status!: string;
}

export const DestinationSchema = SchemaFactory.createForClass(Destination);
DestinationSchema.index({ organizationId: 1, country: 1, name: 1 });
