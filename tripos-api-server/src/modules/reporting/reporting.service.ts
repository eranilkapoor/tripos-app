import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../common/dto/crm-list-query.dto';
import { scopeFilter } from '../../common/utils/crm-list.util';
import { fromMinorUnits, toMinorUnits } from '../../common/utils/money.util';
import { Booking } from '../bookings/schemas/booking.schema';
import { Campaign } from '../campaigns/schemas/campaign.schema';
import { Lead } from '../leads/schemas/leads.schema';
import { OperationTask } from '../operations/schemas/operation-task.schema';
import { Payment } from '../payments/schemas/payment.schema';
import { Quotation } from '../quotations/schemas/quotation.schema';

@Injectable()
export class ReportingService {
  constructor(
    @InjectModel(Lead.name) private readonly leads: Model<Lead>,
    @InjectModel(Quotation.name) private readonly quotations: Model<Quotation>,
    @InjectModel(Booking.name) private readonly bookings: Model<Booking>,
    @InjectModel(OperationTask.name)
    private readonly operationsModel: Model<OperationTask>,
    @InjectModel(Payment.name) private readonly payments: Model<Payment>,
    @InjectModel(Campaign.name) private readonly campaigns: Model<Campaign>,
  ) {}

  async overview(query: CrmListQueryDto) {
    const filter = scopeFilter(query);
    const [leads, quotations, bookings, operations, payments, campaigns] =
      await Promise.all([
        this.leads.countDocuments(filter).exec(),
        this.quotations.countDocuments(filter).exec(),
        this.bookings.countDocuments(filter).exec(),
        this.operationsModel.countDocuments(filter).exec(),
        this.payments.countDocuments(filter).exec(),
        this.campaigns.countDocuments(filter).exec(),
      ]);
    return {
      totals: { leads, quotations, bookings, operations, payments, campaigns },
      generatedAt: new Date().toISOString(),
    };
  }

  async salesFunnel(query: CrmListQueryDto) {
    const filter = scopeFilter(query);
    return {
      leadsByStage: await groupCount(this.leads, filter, 'stage'),
      quotationsByStatus: await groupCount(this.quotations, filter, 'status'),
      bookingsByStatus: await groupCount(this.bookings, filter, 'status'),
    };
  }

  async operations(query: CrmListQueryDto) {
    const filter = scopeFilter(query);
    return {
      tasksByStatus: await groupCount(this.operationsModel, filter, 'status'),
      tasksByPriority: await groupCount(
        this.operationsModel,
        filter,
        'priority',
      ),
    };
  }

  async finance(query: CrmListQueryDto) {
    const rows = await this.payments.find(scopeFilter(query)).lean().exec();
    return rows.reduce(
      (summary, payment) => {
        const type = String(payment.type ?? 'unknown');
        const amount = fromMinorUnits(
          payment.amountMinor ?? toMinorUnits(payment.amount),
        );
        summary[type] = (summary[type] ?? 0) + amount;
        summary.total += amount;
        return summary;
      },
      { total: 0 } as Record<string, number>,
    );
  }
}

async function groupCount<T>(
  model: Model<T>,
  filter: Record<string, unknown>,
  field: string,
) {
  return model
    .aggregate([
      { $match: filter },
      { $group: { _id: `$${field}`, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    .exec();
}
