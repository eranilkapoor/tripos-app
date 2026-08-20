import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ collection: COLLECTION_NAMES.AUDIT_LOG, timestamps: true })
export class AuditLog {
  @Prop({ required: true, index: true }) action!: string;
  @Prop({ required: true, index: true }) method!: string;
  @Prop({ required: true, index: true }) path!: string;
  @Prop({ index: true }) statusCode?: number;
  @Prop({ required: true, index: true }) outcome!: string;
  @Prop({ index: true }) organizationId?: string;
  @Prop({ index: true }) branchId?: string;
  @Prop({ index: true }) actorId?: string;
  @Prop({ index: true }) actorRole?: string;
  @Prop({ index: true }) actorEmail?: string;
  @Prop({ index: true }) entityType?: string;
  @Prop({ index: true }) entityId?: string;
  @Prop({ trim: true }) requestId?: string;
  @Prop({ trim: true }) correlationId?: string;
  @Prop({ trim: true }) source?: string;
  @Prop({ trim: true }) severity?: string;
  @Prop() ip?: string;
  @Prop() userAgent?: string;
  @Prop({ type: Object, default: {} }) before!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) after!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) diff!: Record<string, unknown>;
  @Prop({ type: Object, default: {} }) metadata!: Record<string, unknown>;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
AuditLogSchema.index({ organizationId: 1, createdAt: -1 });
AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ path: 1, createdAt: -1 });
AuditLogSchema.index({ organizationId: 1, entityType: 1, entityId: 1 });
