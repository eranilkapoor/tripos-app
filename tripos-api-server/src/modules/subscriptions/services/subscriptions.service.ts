import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import {
  deleteScopedCrmRecord,
  findScopedCrmRecord,
  listCrmRecords,
  updateScopedCrmRecord,
} from '../../../common/utils/crm-list.util';
import {
  CancelSubscriptionDto,
  CreatePricingPlanDto,
  SubscribeOrganizationDto,
} from '../dto/subscription.dto';
import { PricingPlan } from '../schemas/pricing-plan.schema';
import { Subscription } from '../schemas/subscription.schema';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(PricingPlan.name)
    private readonly planModel: Model<PricingPlan>,
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
  ) {}

  createPlan(dto: CreatePricingPlanDto) {
    return this.planModel.create(dto);
  }

  async listPlans(query: CrmListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.search) {
      const search = new RegExp(escapeRegex(query.search), 'i');
      filter.$or = [{ code: search }, { name: search }, { audience: search }];
    }
    const [items, total] = await Promise.all([
      this.planModel
        .find(filter)
        .sort({ priceMinor: 1, updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.planModel.countDocuments(filter).exec(),
    ]);
    return { items, total, page, limit };
  }

  async findPlan(id: string) {
    const plan = await this.planModel.findById(id).lean().exec();
    if (!plan) throw new NotFoundException('Pricing plan not found');
    return plan;
  }

  async updatePlan(id: string, dto: Partial<CreatePricingPlanDto>) {
    const plan = await this.planModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .exec();
    if (!plan) throw new NotFoundException('Pricing plan not found');
    return plan;
  }

  async updatePlanStatus(id: string, dto: StatusUpdateDto) {
    return this.updatePlan(id, { status: dto.status });
  }

  async removePlan(id: string) {
    const plan = await this.planModel.findByIdAndDelete(id).lean().exec();
    if (!plan) throw new NotFoundException('Pricing plan not found');
    return { deleted: true, id };
  }

  listSubscriptions(query: CrmListQueryDto) {
    return listCrmRecords(this.subscriptionModel, query, [
      'planCode',
      'planName',
      'audience',
      'paymentProvider',
      'checkoutReference',
      'providerSubscriptionId',
    ]);
  }

  findSubscription(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(
      this.subscriptionModel,
      id,
      query,
      'Subscription not found',
    );
  }

  async current(query: CrmListQueryDto) {
    const organizationId = query.organizationId;
    if (!organizationId)
      throw new ForbiddenException('Organization context is required');
    const subscription = await this.subscriptionModel
      .findOne({
        organizationId,
        status: { $in: ['trialing', 'active', 'past_due', 'pending'] },
      })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
    return subscription ?? null;
  }

  async subscribe(dto: SubscribeOrganizationDto, query: CrmListQueryDto) {
    const organizationId = query.organizationId;
    if (!organizationId)
      throw new ForbiddenException('Organization context is required');
    const plan = await this.planModel
      .findOne({ code: dto.planCode, status: 'active' })
      .lean()
      .exec();
    if (!plan) throw new BadRequestException('Active pricing plan not found');
    const seats = Math.max(
      dto.seats ?? plan.includedSeats ?? 1,
      plan.minSeats ?? 1,
    );
    const trialDays = plan.trialDays ?? 0;
    const startsAt = new Date();
    const renewsAt = calculateRenewal(startsAt, plan.billingCycle);
    const subscription = await this.subscriptionModel
      .findOneAndUpdate(
        {
          organizationId,
          status: { $in: ['trialing', 'active', 'past_due', 'pending'] },
        },
        {
          $set: {
            organizationId,
            branchId: query.branchId ?? '',
            planCode: plan.code,
            planName: plan.name,
            audience: plan.audience,
            billingCycle: plan.billingCycle,
            currencyCode: plan.currencyCode,
            amountMinor: calculateSeatAmount(plan, seats),
            setupFeeMinor: plan.setupFeeMinor ?? 0,
            seats,
            trialDays,
            trialEndsAt: trialDays
              ? new Date(startsAt.getTime() + trialDays * 24 * 60 * 60 * 1000)
              : undefined,
            startsAt,
            renewsAt,
            cancelledAt: undefined,
            cancellationReason: undefined,
            paymentProvider: dto.paymentProvider ?? 'sandbox',
            providerCustomerId: dto.providerCustomerId,
            providerSubscriptionId: dto.providerSubscriptionId,
            checkoutReference: `sub_${Date.now().toString(36)}`,
            billingProfile: dto.billingProfile ?? {},
            graceEndsAt: dto.graceEndsAt
              ? new Date(dto.graceEndsAt)
              : undefined,
            paymentMethod: dto.paymentMethod ?? {},
            usage: dto.usage ?? {},
            invoices: dto.invoices ?? [],
            limitsSnapshot: plan.limits ?? {},
            featuresSnapshot: plan.features ?? [],
            metadata: dto.metadata ?? {},
            status: trialDays ? 'trialing' : 'active',
          },
        },
        { returnDocument: 'after', upsert: true },
      )
      .exec();
    return subscription;
  }

  updateSubscription(
    id: string,
    dto: Partial<SubscribeOrganizationDto> & { status?: string },
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.subscriptionModel,
      id,
      query,
      dto,
      'Subscription not found',
    );
  }

  updateSubscriptionStatus(
    id: string,
    dto: StatusUpdateDto,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.subscriptionModel,
      id,
      query,
      { status: dto.status },
      'Subscription not found',
    );
  }

  cancel(id: string, dto: CancelSubscriptionDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.subscriptionModel,
      id,
      query,
      {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason: dto.reason,
      },
      'Subscription not found',
    );
  }

  removeSubscription(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(
      this.subscriptionModel,
      id,
      query,
      'Subscription not found',
    );
  }
}

function calculateSeatAmount(plan: PricingPlan, seats: number) {
  const includedSeats = plan.includedSeats ?? 0;
  const extraSeats = Math.max(0, seats - includedSeats);
  return (plan.priceMinor ?? 0) + extraSeats * (plan.extraSeatPriceMinor ?? 0);
}

function calculateRenewal(startsAt: Date, billingCycle: string) {
  const renewsAt = new Date(startsAt);
  if (billingCycle === 'yearly')
    renewsAt.setFullYear(renewsAt.getFullYear() + 1);
  else if (billingCycle === 'quarterly')
    renewsAt.setMonth(renewsAt.getMonth() + 3);
  else if (billingCycle === 'half_yearly')
    renewsAt.setMonth(renewsAt.getMonth() + 6);
  else renewsAt.setMonth(renewsAt.getMonth() + 1);
  return renewsAt;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
