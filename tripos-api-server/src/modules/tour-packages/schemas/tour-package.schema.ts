import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type TourPackageDocument = HydratedDocument<TourPackage>;

@Schema({ collection: COLLECTION_NAMES.TOUR_PACKAGE, timestamps: true })
export class TourPackage {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) title!: string;
  @Prop({ required: true, trim: true, index: true }) destination!: string;
  @Prop({ trim: true, index: true }) category?: string;
  @Prop({ default: 0 }) durationDays!: number;
  @Prop({ default: 0 }) basePrice!: number;
  @Prop({ default: 'INR', trim: true }) currency!: string;
  @Prop({ type: [String], default: [] }) inclusions!: string[];
  @Prop({ type: [String], default: [] }) exclusions!: string[];
  @Prop({ type: [Object], default: [] }) itinerary!: Array<Record<string, unknown>>;
  @Prop({ enum: ['draft', 'active', 'inactive', 'archived'], default: 'draft', index: true }) status!: string;
}

export const TourPackageSchema = SchemaFactory.createForClass(TourPackage);
TourPackageSchema.index({ organizationId: 1, destination: 1, status: 1 });
