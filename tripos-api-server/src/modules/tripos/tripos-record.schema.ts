import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TriposRecordDocument = HydratedDocument<TriposRecord>;

@Schema({ collection: "tripos_records", timestamps: true })
export class TriposRecord {
  @Prop({ default: "demo-org", index: true })
  organizationId!: string;

  @Prop({ default: "main", index: true })
  branchId!: string;

  @Prop({ required: true, index: true })
  moduleKey!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ default: "open", index: true })
  status!: string;

  @Prop({ default: "medium" })
  priority!: string;

  @Prop({ type: Object, default: {} })
  payload!: Record<string, unknown>;
}

export const TriposRecordSchema = SchemaFactory.createForClass(TriposRecord);

