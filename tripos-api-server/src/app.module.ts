import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { TriposModule } from "./modules/tripos/tripos.module";
import configuration from "./config";
import { LeadsModule } from "./modules/leads/leads.module";
import { FinanceModule } from "./modules/finance/finance.module";
import { QuotationsModule } from "./modules/quotations/quotations.module";
import { ItinerariesModule } from "./modules/itineraries/itineraries.module";
import { BookingsModule } from "./modules/bookings/bookings.module";
import { SuppliersModule } from "./modules/suppliers/suppliers.module";
import { OperationsModule } from "./modules/operations/operations.module";
import { B2BAgentsModule } from "./modules/b2b-agents/b2b-agents.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { DestinationsModule } from "./modules/destinations/destinations.module";
import { TourPackagesModule } from "./modules/tour-packages/tour-packages.module";
import { TravelDocumentsModule } from "./modules/travel-documents/travel-documents.module";
import { VouchersModule } from "./modules/vouchers/vouchers.module";
import { SupportTicketsModule } from "./modules/support-tickets/support-tickets.module";

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
    QuotationsModule,
    ItinerariesModule,
    BookingsModule,
    SuppliersModule,
    OperationsModule,
    B2BAgentsModule,
    PaymentsModule,
    CustomersModule,
    DestinationsModule,
    TourPackagesModule,
    TravelDocumentsModule,
    VouchersModule,
    SupportTicketsModule,
    TriposModule,
  ],
})
export class AppModule {}
