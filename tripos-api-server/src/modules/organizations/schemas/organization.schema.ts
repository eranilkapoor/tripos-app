import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type OrganizationDocument = HydratedDocument<Organization>;

@Schema({ collection: COLLECTION_NAMES.ORGANIZATION, timestamps: true })
export class Organization {
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({
    required: true,
    trim: true,
    uppercase: true,
    unique: true,
    index: true,
  })
  code!: string;
  @Prop({
    enum: ['tripos_cloud', 'customer_managed', 'hybrid_sync'],
    default: 'tripos_cloud',
    index: true,
  })
  dataHostingMode!: string;
  @Prop({
    type: [Object],
    default: [{ id: 'main', name: 'Main Branch', city: 'Delhi' }],
  })
  branches!: Array<Record<string, unknown>>;
  @Prop({
    type: Object,
    default: { syncMode: 'realtime', offlineWindowHours: 24 },
  })
  syncPolicy!: Record<string, unknown>;
  @Prop({
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    index: true,
  })
  status!: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
