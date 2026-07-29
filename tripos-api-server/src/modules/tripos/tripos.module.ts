import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TriposController } from './tripos.controller';
import { TriposService } from './tripos.service';
import {
  Lead,
  LeadActivity,
  LeadActivitySchema,
  LeadSchema,
} from '../leads/schemas/leads.schema';
import {
  Quotation,
  QuotationSchema,
} from '../quotations/schemas/quotation.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import { Supplier, SupplierSchema } from '../suppliers/schemas/supplier.schema';
import {
  OperationTask,
  OperationTaskSchema,
} from '../operations/schemas/operation-task.schema';
import {
  B2BAgent,
  B2BAgentSchema,
} from '../b2b-agents/schemas/b2b-agent.schema';
import { Payment, PaymentSchema } from '../payments/schemas/payment.schema';
import { Invoice, InvoiceSchema } from '../finance/schemas/invoice.schema';
import { Tenant, TenantSchema } from '../tenants/schemas/tenant.schema';
import { AuditLog, AuditLogSchema } from '../audit/schemas/audit-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lead.name, schema: LeadSchema },
      { name: LeadActivity.name, schema: LeadActivitySchema },
      { name: Quotation.name, schema: QuotationSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Supplier.name, schema: SupplierSchema },
      { name: OperationTask.name, schema: OperationTaskSchema },
      { name: B2BAgent.name, schema: B2BAgentSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Tenant.name, schema: TenantSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  controllers: [TriposController],
  providers: [TriposService],
})
export class TriposModule {}
