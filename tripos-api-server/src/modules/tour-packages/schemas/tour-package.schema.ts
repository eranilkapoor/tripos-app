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
  @Prop({ trim: true, index: true }) packageCode?: string;
  @Prop({ trim: true, index: true }) ownerId?: string;
  @Prop({ default: 0 }) durationDays!: number;
  @Prop({ default: 0 }) basePrice!: number;
  @Prop({ default: 0 }) basePriceMinor!: number;
  @Prop({ default: 'INR', trim: true }) currency!: string;
  @Prop({ type: [String], default: [] }) inclusions!: string[];
  @Prop({ type: [String], default: [] }) exclusions!: string[];
  @Prop({ type: [Object], default: [] }) itinerary!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: Object, default: {} }) costing!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) bookingRules!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) cancellationPolicy!: Record<
    string,
    unknown
  >;
  @Prop({ type: Object, default: {} }) seo!: Record<string, unknown>;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ type: Object, default: {} }) customFields!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({
    enum: ['draft', 'active', 'inactive', 'archived'],
    default: 'draft',
    index: true,
  })
  status!: string;
}

export const TourPackageSchema = SchemaFactory.createForClass(TourPackage);
TourPackageSchema.index({ organizationId: 1, destination: 1, status: 1 });
TourPackageSchema.index({ organizationId: 1, packageCode: 1 });
