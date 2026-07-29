import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ collection: COLLECTION_NAMES.CUSTOMER, timestamps: true })
export class Customer {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) name!: string;
  @Prop({ trim: true, lowercase: true, index: true }) email?: string;
  @Prop({ trim: true, index: true }) phone?: string;
  @Prop({ enum: ['b2c', 'corporate', 'family', 'repeat'], default: 'b2c', index: true }) customerType!: string;
  @Prop({ trim: true }) source?: string;
  @Prop({ trim: true }) city?: string;
  @Prop({ trim: true }) country?: string;
  @Prop({ enum: ['active', 'inactive', 'blocked'], default: 'active', index: true }) status!: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index({ organizationId: 1, phone: 1 });
