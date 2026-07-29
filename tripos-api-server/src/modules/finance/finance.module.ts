import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesController } from './controllers/invoices.controller';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { InvoicesService } from './services/invoices.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class FinanceModule {}

