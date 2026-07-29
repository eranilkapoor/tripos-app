import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Campaign, CampaignSchema } from '../campaigns/schemas/campaign.schema';
import { Lead, LeadSchema } from '../leads/schemas/leads.schema';
import {
  OperationTask,
  OperationTaskSchema,
} from '../operations/schemas/operation-task.schema';
import { Payment, PaymentSchema } from '../payments/schemas/payment.schema';
import {
  Quotation,
  QuotationSchema,
} from '../quotations/schemas/quotation.schema';
import { ReportingController } from './controllers/reporting.controller';
import { ReportingService } from './reporting.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lead.name, schema: LeadSchema },
      { name: Quotation.name, schema: QuotationSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: OperationTask.name, schema: OperationTaskSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Campaign.name, schema: CampaignSchema },
    ]),
  ],
  controllers: [ReportingController],
  providers: [ReportingService],
})
export class ReportingModule {}
