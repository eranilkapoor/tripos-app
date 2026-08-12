import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { scopeFilter } from '../../../common/utils/crm-list.util';
import { fromMinorUnits, toMinorUnits } from '../../../common/utils/money.util';
import { Booking } from '../../bookings/schemas/booking.schema';
import { Payment } from '../../payments/schemas/payment.schema';
import { CreateRefundDto } from '../dto/finance-operations.dto';

@Injectable()
export class FinanceOperationsService {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
  ) {}

  receivables(query: CrmListQueryDto) {
    return this.listByType(query, 'receivable');
  }

  payables(query: CrmListQueryDto) {
    return this.listByType(query, 'payable');
  }

  createRefund(dto: CreateRefundDto) {
    return this.paymentModel.create({
      ...dto,
      type: 'refund',
      amountMinor: toMinorUnits(dto.amount),
      currencyCode: dto.currencyCode ?? 'INR',
      status: 'pending',
      metadata: {
        ...(dto.metadata ?? {}),
        reason: dto.reason,
      },
    });
  }

  async profitability(bookingId: string, query: CrmListQueryDto) {
    const filter = scopeFilter(query, { bookingId });
    const [booking, payments] = await Promise.all([
      this.bookingModel
        .findOne(scopeFilter(query, { _id: bookingId }) as never)
        .lean()
        .exec(),
      this.paymentModel.find(filter).lean().exec(),
    ]);
    const totals = payments.reduce(
      (summary, payment) => {
        const amount = fromMinorUnits(
          payment.amountMinor ?? toMinorUnits(payment.amount),
        );
        if (payment.type === 'receivable') summary.revenue += amount;
        if (payment.type === 'payable') summary.cost += amount;
        if (payment.type === 'refund') summary.refunds += amount;
        if (payment.type === 'commission') summary.commission += amount;
        return summary;
      },
      { revenue: 0, cost: 0, refunds: 0, commission: 0 },
    );
    return {
      booking,
      ...totals,
      grossProfit: totals.revenue - totals.cost - totals.refunds,
      netProfit:
        totals.revenue - totals.cost - totals.refunds - totals.commission,
      paymentCount: payments.length,
    };
  }

  async reconciliation(query: CrmListQueryDto) {
    const rows = await this.paymentModel.find(scopeFilter(query)).lean().exec();
    return rows.reduce(
      (summary, payment) => {
        const bucket = `${payment.type}_${payment.status}`;
        summary.totals[bucket] =
          (summary.totals[bucket] ?? 0) +
          fromMinorUnits(payment.amountMinor ?? toMinorUnits(payment.amount));
        summary.counts[bucket] = (summary.counts[bucket] ?? 0) + 1;
        return summary;
      },
      {
        totals: {} as Record<string, number>,
        counts: {} as Record<string, number>,
      },
    );
  }

  private async listByType(query: CrmListQueryDto, type: string) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter = scopeFilter(query, { type });
    if (query.status) filter.status = query.status;
    const [items, total] = await Promise.all([
      this.paymentModel
        .find(filter)
        .sort({ dueDate: 1, updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.paymentModel.countDocuments(filter).exec(),
    ]);
    return { items, total, page, limit };
  }
}
