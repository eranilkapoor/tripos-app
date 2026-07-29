import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TriposModule } from './modules/tripos/tripos.module';
import configuration from './config';
import { LeadsModule } from './modules/leads/leads.module';
import { FinanceModule } from './modules/finance/finance.module';
import { QuotationsModule } from './modules/quotations/quotations.module';
import { ItinerariesModule } from './modules/itineraries/itineraries.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { OperationsModule } from './modules/operations/operations.module';
import { B2BAgentsModule } from './modules/b2b-agents/b2b-agents.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CustomersModule } from './modules/customers/customers.module';
import { DestinationsModule } from './modules/destinations/destinations.module';
import { TourPackagesModule } from './modules/tour-packages/tour-packages.module';
import { TravelDocumentsModule } from './modules/travel-documents/travel-documents.module';
import { VouchersModule } from './modules/vouchers/vouchers.module';
import { SupportTicketsModule } from './modules/support-tickets/support-tickets.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuditModule } from './modules/audit/audit.module';
import { StorageModule } from './modules/storage/storage.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { AiAssistantModule } from './modules/ai/ai-assistant.module';
import { TenantContextMiddleware } from './common/middleware/tenant-context.middleware';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      isGlobal: true,
      load: configuration,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.uri'),
        autoIndex: configService.get<boolean>('mongo.autoIndex'),
        maxPoolSize: configService.get<number>('mongo.maxPoolSize'),
        minPoolSize: configService.get<number>('mongo.minPoolSize'),
        serverSelectionTimeoutMS: configService.get<number>(
          'mongo.serverSelectionTimeoutMs',
        ),
        socketTimeoutMS: configService.get<number>('mongo.socketTimeoutMs'),
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
    CampaignsModule,
    TenantsModule,
    AuthModule,
    AuditModule,
    StorageModule,
    IntegrationsModule,
    ReportingModule,
    AiAssistantModule,
    TriposModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantContextMiddleware).forRoutes('{*path}');
  }
}
