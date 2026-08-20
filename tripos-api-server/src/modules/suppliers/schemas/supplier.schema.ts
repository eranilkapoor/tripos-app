import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({ collection: COLLECTION_NAMES.SUPPLIER, timestamps: true })
export class Supplier {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, index: true }) name!: string;
  @Prop({ required: true, trim: true, index: true }) type!: string;
  @Prop({ trim: true, index: true }) destination?: string;
  @Prop({ trim: true, index: true }) supplierCode?: string;
  @Prop({ trim: true, index: true }) ownerId?: string;
  @Prop({ trim: true, index: true }) legalName?: string;
  @Prop({ trim: true, index: true }) market?: string;
  @Prop({ trim: true, index: true }) preferredCurrency?: string;
  @Prop({ trim: true, index: true }) accountManagerId?: string;
  @Prop({ type: [Object], default: [] }) contacts!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) contracts!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [Object], default: [] }) rates!: Array<Record<string, unknown>>;
  @Prop({ type: [Object], default: [] }) confirmations!: Array<
    Record<string, unknown>
  >;
  @Prop({ default: 0 }) creditLimit!: number;
  @Prop({ default: 0 }) payable!: number;
  @Prop({ default: 0 }) rating!: number;
  @Prop({ type: Object, default: {} }) address!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) taxProfile!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) bankDetails!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) paymentTerms!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) compliance!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) performance!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) serviceCoverage!: Record<
    string,
    unknown
  >;
  @Prop({ type: [Object], default: [] }) documents!: Array<
    Record<string, unknown>
  >;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ type: Object, default: {} }) customFields!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
  @Prop({
    enum: ['active', 'inactive', 'blocked'],
    default: 'active',
    index: true,
  })
  status!: string;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
SupplierSchema.index({ organizationId: 1, type: 1, destination: 1 });
SupplierSchema.index({ organizationId: 1, supplierCode: 1 });
