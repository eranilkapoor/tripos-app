import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TriposController } from "./tripos.controller";
import { TriposRecord, TriposRecordSchema } from "./tripos-record.schema";
import { FinanceModule } from "../finance/finance.module";
import { TriposService } from "./tripos.service";

@Module({
  imports: [
    FinanceModule,
    MongooseModule.forFeature([
      { name: TriposRecord.name, schema: TriposRecordSchema },
    ]),
  ],
  controllers: [TriposController],
  providers: [TriposService],
})
export class TriposModule {}
