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
  @Prop({ trim: true }) bestSeason?: string;
  @Prop({ type: [String], default: [] }) highlights!: string[];
  @Prop({ trim: true }) visaRequirement?: string;
  @Prop({ enum: ['active', 'inactive'], default: 'active', index: true }) status!: string;
}

export const DestinationSchema = SchemaFactory.createForClass(Destination);
DestinationSchema.index({ organizationId: 1, country: 1, name: 1 });
