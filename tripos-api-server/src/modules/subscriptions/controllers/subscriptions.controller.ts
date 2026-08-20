import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { organizationScopedQuery } from '../../../common/utils/organization-scope.util';
import {
  CancelSubscriptionDto,
  CreatePricingPlanDto,
  SubscribeOrganizationDto,
} from '../dto/subscription.dto';
import { SubscriptionsService } from '../services/subscriptions.service';

@ApiTags('subscriptions')
@Controller()
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @Roles('platform_admin')
  @Post('plans')
  createPlan(@Body() dto: CreatePricingPlanDto) {
    return this.service.createPlan(dto);
  }

  @Get('plans')
  listPlans(@Query() query: CrmListQueryDto) {
    return this.service.listPlans(query);
  }

  @Get('plans/:id')
  findPlan(@Param('id') id: string) {
    return this.service.findPlan(id);
  }

  @Roles('platform_admin')
  @Patch('plans/:id')
  updatePlan(
    @Param('id') id: string,
    @Body() dto: Partial<CreatePricingPlanDto>,
  ) {
    return this.service.updatePlan(id, dto);
  }

  @Roles('platform_admin')
  @Patch('plans/:id/status')
  updatePlanStatus(@Param('id') id: string, @Body() dto: StatusUpdateDto) {
    return this.service.updatePlanStatus(id, dto);
  }

  @Roles('platform_admin')
  @Delete('plans/:id')
  removePlan(@Param('id') id: string) {
    return this.service.removePlan(id);
  }

  @Get('subscriptions')
  listSubscriptions(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.listSubscriptions(
      organizationScopedQuery(query, request),
    );
  }

  @Get('subscriptions/current')
  current(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.current(organizationScopedQuery(query, request));
  }

  @Post('subscriptions')
  subscribe(
    @Body() dto: SubscribeOrganizationDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.subscribe(dto, organizationScopedQuery(query, request));
  }

  @Get('subscriptions/:id')
  findSubscription(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findSubscription(
      id,
      organizationScopedQuery(query, request),
    );
  }

  @Patch('subscriptions/:id')
  updateSubscription(
    @Param('id') id: string,
    @Body() dto: Partial<SubscribeOrganizationDto> & { status?: string },
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateSubscription(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Patch('subscriptions/:id/status')
  updateSubscriptionStatus(
    @Param('id') id: string,
    @Body() dto: StatusUpdateDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateSubscriptionStatus(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Post('subscriptions/:id/cancel')
  cancel(
    @Param('id') id: string,
    @Body() dto: CancelSubscriptionDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.cancel(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Roles('platform_admin')
  @Delete('subscriptions/:id')
  removeSubscription(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.removeSubscription(
      id,
      organizationScopedQuery(query, request),
    );
  }
}
