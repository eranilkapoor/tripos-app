import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { TriposModule } from "./modules/tripos/tripos.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.development", ".env"],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URI") ?? "mongodb://localhost:27017/tripos",
        autoIndex: configService.get<string>("MONGO_AUTO_INDEX") === "true",
      }),
    }),
    TriposModule,
  ],
})
export class AppModule {}
