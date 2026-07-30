import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { organizationScopedQuery } from '../../../common/utils/organization-scope.util';
import { CreateRefundDto } from '../dto/finance-operations.dto';
import { FinanceOperationsService } from '../services/finance-operations.service';

type OrganizationRequest = Request & {
  user?: { organizationId?: unknown; branchId?: unknown };
};

@ApiTags('finance')
@Controller('finance')
export class FinanceOperationsController {
  constructor(private readonly service: FinanceOperationsService) {}

  @Get('receivables')
  receivables(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.receivables(organizationScopedQuery(query, request));
  }

  @Get('payables')
  payables(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.payables(organizationScopedQuery(query, request));
  }

  @Post('refunds')
  createRefund(
    @Body() dto: CreateRefundDto,
    @Req() request: OrganizationRequest,
  ) {
    return this.service.createRefund({
      ...dto,
      organizationId: String(
        request.user?.organizationId ?? dto.organizationId,
      ),
      branchId: String(request.user?.branchId ?? dto.branchId ?? ''),
    });
  }

  @Get('bookings/:bookingId/profitability')
  profitability(
    @Param('bookingId') bookingId: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.profitability(
      bookingId,
      organizationScopedQuery(query, request),
    );
  }

  @Get('reconciliation')
  reconciliation(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.reconciliation(organizationScopedQuery(query, request));
  }
}
