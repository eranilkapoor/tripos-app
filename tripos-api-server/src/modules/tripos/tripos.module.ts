import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TriposController } from "./tripos.controller";
import { TriposRecord, TriposRecordSchema } from "./tripos-record.schema";
import { TriposInvoice, TriposInvoiceSchema } from "./tripos-invoice.schema";
import { TriposService } from "./tripos.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TriposRecord.name, schema: TriposRecordSchema },
      { name: TriposInvoice.name, schema: TriposInvoiceSchema },
    ]),
  ],
  controllers: [TriposController],
  providers: [TriposService],
})
export class TriposModule {}
