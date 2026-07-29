import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Payment, PaymentSchema } from '../payments/schemas/payment.schema';
import { FinanceOperationsController } from './controllers/finance-operations.controller';
import { InvoicesController } from './controllers/invoices.controller';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { FinanceOperationsService } from './services/finance-operations.service';
import { InvoicesService } from './services/invoices.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [InvoicesController, FinanceOperationsController],
  providers: [InvoicesService, FinanceOperationsService],
  exports: [InvoicesService],
})
export class FinanceModule {}
