import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type ItineraryDocument = HydratedDocument<Itinerary>;

@Schema({ collection: COLLECTION_NAMES.ITINERARY, timestamps: true })
export class Itinerary {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ index: true }) quotationId?: string;
  @Prop({ required: true, trim: true }) title!: string;
  @Prop({ required: true, trim: true, index: true }) destination!: string;
  @Prop({ type: [Object], default: [] }) days!: Array<Record<string, unknown>>;
  @Prop({ type: [String], default: [] }) images!: string[];
  @Prop({
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true,
  })
  status!: string;
}

export const ItinerarySchema = SchemaFactory.createForClass(Itinerary);
ItinerarySchema.index({ organizationId: 1, destination: 1, status: 1 });
