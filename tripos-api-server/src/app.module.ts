import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TriposModule } from "./modules/tripos/tripos.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TriposModule,
  ],
})
export class AppModule {}

