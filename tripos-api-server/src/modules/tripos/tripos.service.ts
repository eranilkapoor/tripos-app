import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppService } from '../../app.service';
import { CrmListQueryDto } from '../../common/dto/crm-list-query.dto';
import { AuditLog } from '../audit/schemas/audit-log.schema';
import { B2BAgent } from '../b2b-agents/schemas/b2b-agent.schema';
import { Booking } from '../bookings/schemas/booking.schema';
import { Customer } from '../customers/schemas/customer.schema';
import { Invoice } from '../finance/schemas/invoice.schema';
import { Lead } from '../leads/schemas/leads.schema';
import { OperationTask } from '../operations/schemas/operation-task.schema';
import { Payment } from '../payments/schemas/payment.schema';
import { Quotation } from '../quotations/schemas/quotation.schema';
import { Supplier } from '../suppliers/schemas/supplier.schema';
import { Tenant } from '../tenants/schemas/tenant.schema';

type ScopedFilter = {
  organizationId: string;
  branchId?: string;
};

@Injectable()
export class TriposService {
  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<Lead>,
    @InjectModel(Quotation.name)
    private readonly quotationModel: Model<Quotation>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    @InjectModel(Customer.name)
    private readonly customerModel: Model<Customer>,
    @InjectModel(Supplier.name)
    private readonly supplierModel: Model<Supplier>,
    @InjectModel(OperationTask.name)
    private readonly operationTaskModel: Model<OperationTask>,
    @InjectModel(B2BAgent.name)
    private readonly b2bAgentModel: Model<B2BAgent>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
    @InjectModel(AuditLog.name) private readonly auditLogModel: Model<AuditLog>,
    private readonly appService: AppService,
  ) {}

  health() {
    const isShuttingDown = this.appService.isShuttingDown();

    return {
      service: 'tripos-api-server',
      status: isShuttingDown ? 'shutting_down' : 'ok',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    };
  }

  async dashboard(query: CrmListQueryDto) {
    const scope = this.scope(query);
    const organizationScope = { organizationId: scope.organizationId };

    const [
      tenant,
      leadTotal,
      newLeads,
      hotLeads,
      openQuotations,
      sentQuotations,
      acceptedQuotations,
      activeBookings,
      confirmedBookings,
      completedBookings,
      customers,
      suppliers,
      activeAgents,
      pendingOperations,
      issueOperations,
      receivables,
      payables,
      invoiced,
      recentAuditLogs,
    ] = await Promise.all([
      this.tenantModel.findById(scope.organizationId).lean().exec(),
      this.leadModel.countDocuments(scope).exec(),
      this.leadModel.countDocuments({ ...scope, stage: 'new' }).exec(),
      this.leadModel.countDocuments({ ...scope, temperature: 'hot' }).exec(),
      this.quotationModel
        .countDocuments({
          ...scope,
          status: { $nin: ['accepted', 'rejected'] },
        })
        .exec(),
      this.quotationModel.countDocuments({ ...scope, status: 'sent' }).exec(),
      this.quotationModel
        .countDocuments({ ...scope, status: 'accepted' })
        .exec(),
      this.bookingModel
        .countDocuments({
          ...scope,
          status: {
            $in: ['pending_payment', 'confirmed', 'partially_confirmed'],
          },
        })
        .exec(),
      this.bookingModel
        .countDocuments({ ...scope, status: 'confirmed' })
        .exec(),
      this.bookingModel
        .countDocuments({ ...scope, status: 'completed' })
        .exec(),
      this.customerModel.countDocuments(scope).exec(),
      this.supplierModel.countDocuments(scope).exec(),
      this.b2bAgentModel.countDocuments({ ...scope, status: 'active' }).exec(),
      this.operationTaskModel
        .countDocuments({ ...scope, status: { $nin: ['completed'] } })
        .exec(),
      this.operationTaskModel
        .countDocuments({ ...scope, status: 'issue' })
        .exec(),
      this.sumPayments(scope, 'receivable', [
        'pending',
        'partially_paid',
        'overdue',
      ]),
      this.sumPayments(scope, 'payable', [
        'pending',
        'partially_paid',
        'overdue',
      ]),
      this.sumInvoices(scope),
      this.auditLogModel
        .find(organizationScope)
        .sort({ createdAt: -1 })
        .limit(8)
        .lean()
        .exec(),
    ]);

    return {
      tenant: tenant?.name ?? 'TripOS Workspace',
      branch: this.branchName(tenant?.branches ?? [], query.branchId),
      metrics: [
        {
          label: 'Total Leads',
          value: leadTotal,
          helper: `${newLeads} new, ${hotLeads} hot`,
        },
        {
          label: 'Open Quotes',
          value: openQuotations,
          helper: `${sentQuotations} sent, ${acceptedQuotations} accepted`,
        },
        {
          label: 'Active Trips',
          value: activeBookings,
          helper: `${confirmedBookings} confirmed, ${completedBookings} completed`,
        },
        {
          label: 'Receivables',
          value: receivables,
          helper: `Payables ${payables}`,
        },
      ],
      counters: {
        customers,
        suppliers,
        activeAgents,
        pendingOperations,
        issueOperations,
        invoiced,
      },
      pipeline: [
        { stage: 'New', count: newLeads },
        { stage: 'Hot Leads', count: hotLeads },
        { stage: 'Quotes Sent', count: sentQuotations },
        { stage: 'Accepted', count: acceptedQuotations },
        { stage: 'Confirmed Trips', count: confirmedBookings },
        { stage: 'Operations Pending', count: pendingOperations },
        { stage: 'Issues', count: issueOperations },
      ],
      recentActivity: recentAuditLogs.map((log) => ({
        id: String(log._id),
        path: log.path,
        method: log.method,
        action: log.action,
        actorId: log.actorId,
        createdAt: (log as { createdAt?: Date }).createdAt,
      })),
      generatedAt: new Date().toISOString(),
    };
  }

  modules() {
    return [
      { key: 'identity', status: 'active', owner: 'platform' },
      { key: 'tenant', status: 'active', owner: 'platform' },
      { key: 'crm', status: 'active', owner: 'sales' },
      { key: 'quotation', status: 'active', owner: 'sales' },
      { key: 'itinerary', status: 'active', owner: 'product' },
      { key: 'booking', status: 'active', owner: 'operations' },
      { key: 'supplier', status: 'active', owner: 'operations' },
      { key: 'operations', status: 'active', owner: 'operations' },
      { key: 'b2b-agent-management', status: 'active', owner: 'sales' },
      { key: 'finance', status: 'active', owner: 'finance' },
      { key: 'marketing', status: 'active', owner: 'growth' },
      { key: 'communication', status: 'active', owner: 'support' },
      { key: 'reporting', status: 'active', owner: 'management' },
      { key: 'ai', status: 'active', owner: 'platform' },
    ];
  }

  private scope(query: CrmListQueryDto): ScopedFilter {
    return {
      organizationId: query.organizationId ?? 'demo-org',
      ...(query.branchId ? { branchId: query.branchId } : {}),
    };
  }

  private async sumPayments(
    scope: ScopedFilter,
    type: string,
    statuses: string[],
  ) {
    const [result] = await this.paymentModel
      .aggregate<{ total: number }>([
        { $match: { ...scope, type, status: { $in: statuses } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ])
      .exec();
    return result?.total ?? 0;
  }

  private async sumInvoices(scope: ScopedFilter) {
    const [result] = await this.invoiceModel
      .aggregate<{ total: number }>([
        { $match: { ...scope, status: { $nin: ['cancelled', 'void'] } } },
        { $group: { _id: null, total: { $sum: '$totals.totalPayable' } } },
      ])
      .exec();
    return result?.total ?? 0;
  }

  private branchName(
    branches: Array<Record<string, unknown>>,
    branchId?: string,
  ) {
    if (!branchId) return 'All branches';
    const branch = branches.find((item) => item.id === branchId);
    return String(branch?.name ?? branchId);
  }
}
