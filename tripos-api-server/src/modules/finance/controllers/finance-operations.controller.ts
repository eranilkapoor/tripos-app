import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { tenantScopedQuery } from '../../../common/utils/tenant-scope.util';
import { CreateRefundDto } from '../dto/finance-operations.dto';
import { FinanceOperationsService } from '../services/finance-operations.service';

type TenantRequest = Request & {
  user?: { tenantId?: unknown; branchId?: unknown };
};

@ApiTags('finance')
@Controller('finance')
export class FinanceOperationsController {
  constructor(private readonly service: FinanceOperationsService) {}

  @Get('receivables')
  receivables(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.receivables(tenantScopedQuery(query, request));
  }

  @Get('payables')
  payables(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.payables(tenantScopedQuery(query, request));
  }

  @Post('refunds')
  createRefund(@Body() dto: CreateRefundDto, @Req() request: TenantRequest) {
    return this.service.createRefund({
      ...dto,
      organizationId: String(request.user?.tenantId ?? dto.organizationId),
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
      tenantScopedQuery(query, request),
    );
  }

  @Get('reconciliation')
  reconciliation(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.reconciliation(tenantScopedQuery(query, request));
  }
}
