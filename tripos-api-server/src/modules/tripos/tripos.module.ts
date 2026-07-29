import { Module } from "@nestjs/common";
import { TriposController } from "./tripos.controller";
import { TriposService } from "./tripos.service";

@Module({
  controllers: [TriposController],
  providers: [TriposService],
})
export class TriposModule {}

