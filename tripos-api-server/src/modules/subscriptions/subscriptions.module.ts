import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { PricingPlan, PricingPlanSchema } from './schemas/pricing-plan.schema';
import {
  Subscription,
  SubscriptionSchema,
} from './schemas/subscription.schema';
import { SubscriptionsService } from './services/subscriptions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PricingPlan.name, schema: PricingPlanSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
