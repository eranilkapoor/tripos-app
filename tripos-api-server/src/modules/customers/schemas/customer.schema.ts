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
  @Prop({
    enum: ['b2c', 'b2b', 'corporate', 'family', 'repeat'],
    default: 'b2c',
    index: true,
  })
  customerType!: string;
  @Prop({ trim: true }) source?: string;
  @Prop({ trim: true }) gender?: string;
  @Prop({ trim: true }) dateOfBirth?: string;
  @Prop({ trim: true }) nationality?: string;
  @Prop({ trim: true }) city?: string;
  @Prop({ trim: true }) country?: string;
  @Prop({ trim: true }) address?: string;
  @Prop({ trim: true }) postalCode?: string;
  @Prop({ trim: true }) preferredLanguage?: string;
  @Prop({ trim: true }) preferredCurrency?: string;
  @Prop({ trim: true, index: true }) ownerId?: string;
  @Prop({ trim: true, index: true }) assignedTo?: string;
  @Prop({ trim: true, index: true }) agentId?: string;
  @Prop({ trim: true, index: true }) companyName?: string;
  @Prop({ trim: true, index: true }) taxRegistrationNo?: string;
  @Prop({ trim: true, index: true }) externalReference?: string;
  @Prop({ type: [Object], default: [] }) travellers!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) emergencyContacts!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) documents!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ type: Object, default: {} }) addressBook!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) preferences!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) consent!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) loyalty!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) riskProfile!: Record<string, unknown>;
  @Prop() lastTravelledAt?: Date;
  @Prop() lastContactedAt?: Date;
  @Prop({ type: Object, default: {} }) customFields!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({
    enum: ['active', 'inactive', 'blocked'],
    default: 'active',
    index: true,
  })
  status!: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index({ organizationId: 1, phone: 1 });
CustomerSchema.index({ organizationId: 1, email: 1 });
CustomerSchema.index({ organizationId: 1, ownerId: 1, status: 1 });
