import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { TriposModule } from "./modules/tripos/tripos.module";
import configuration from "./config";
import { LeadsModule } from "./modules/leads/leads.module";
import { FinanceModule } from "./modules/finance/finance.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.development", ".env"],
      isGlobal: true,
      load: configuration,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("mongo.uri"),
        autoIndex: configService.get<boolean>("mongo.autoIndex"),
        maxPoolSize: configService.get<number>("mongo.maxPoolSize"),
        minPoolSize: configService.get<number>("mongo.minPoolSize"),
        serverSelectionTimeoutMS: configService.get<number>(
          "mongo.serverSelectionTimeoutMs",
        ),
        socketTimeoutMS: configService.get<number>("mongo.socketTimeoutMs"),
      }),
    }),
    LeadsModule,
    FinanceModule,
    TriposModule,
  ],
})
export class AppModule {}
