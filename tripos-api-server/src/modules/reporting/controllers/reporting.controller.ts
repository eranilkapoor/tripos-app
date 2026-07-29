import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { tenantScopedQuery } from '../../../common/utils/tenant-scope.util';
import { ReportingService } from '../reporting.service';

@ApiTags('reporting')
@Controller('reporting')
export class ReportingController {
  constructor(private readonly service: ReportingService) {}

  @Get('overview')
  overview(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.overview(tenantScopedQuery(query, request));
  }

  @Get('sales-funnel')
  salesFunnel(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.salesFunnel(tenantScopedQuery(query, request));
  }

  @Get('operations')
  operations(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.operations(tenantScopedQuery(query, request));
  }

  @Get('finance')
  finance(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.finance(tenantScopedQuery(query, request));
  }
}
