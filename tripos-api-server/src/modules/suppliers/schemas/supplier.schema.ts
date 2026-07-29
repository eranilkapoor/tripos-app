import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({ collection: COLLECTION_NAMES.SUPPLIER, timestamps: true })
export class Supplier {
  @Prop({ default: 'demo-org', index: true }) organizationId!: string;
  @Prop({ required: true, trim: true, index: true }) name!: string;
  @Prop({ required: true, trim: true, index: true }) type!: string;
  @Prop({ trim: true, index: true }) destination?: string;
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
  @Prop({
    enum: ['active', 'inactive', 'blocked'],
    default: 'active',
    index: true,
  })
  status!: string;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
SupplierSchema.index({ organizationId: 1, type: 1, destination: 1 });
