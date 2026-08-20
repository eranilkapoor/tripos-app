import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type ItineraryDocument = HydratedDocument<Itinerary>;

@Schema({ collection: COLLECTION_NAMES.ITINERARY, timestamps: true })
export class Itinerary {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ index: true }) quotationId?: string;
  @Prop({ index: true }) bookingId?: string;
  @Prop({ index: true }) customerId?: string;
  @Prop({ trim: true, index: true }) templateCode?: string;
  @Prop({ trim: true, index: true }) language?: string;
  @Prop({ trim: true, index: true }) ownerId?: string;
  @Prop({ default: 1 }) version!: number;
  @Prop({ required: true, trim: true }) title!: string;
  @Prop({ required: true, trim: true, index: true }) destination!: string;
  @Prop({ type: [Object], default: [] }) days!: Array<Record<string, unknown>>;
  @Prop({ type: [String], default: [] }) images!: string[];
  @Prop({ type: Object, default: {} }) inclusions!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) exclusions!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) travellerNotes!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) presentation!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) sharing!: Record<string, unknown>;
  @Prop({ type: [Object], default: [] }) revisions!: Array<
    Record<string, unknown>
  >;
  @Prop() publishedAt?: Date;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ type: Object, default: {} }) customFields!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true,
  })
  status!: string;
}

export const ItinerarySchema = SchemaFactory.createForClass(Itinerary);
ItinerarySchema.index({ organizationId: 1, destination: 1, status: 1 });
ItinerarySchema.index({ organizationId: 1, ownerId: 1, status: 1 });
