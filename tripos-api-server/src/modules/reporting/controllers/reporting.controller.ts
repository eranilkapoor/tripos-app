import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { organizationScopedQuery } from '../../../common/utils/organization-scope.util';
import { ReportingService } from '../reporting.service';

@ApiTags('reporting')
@Controller('reporting')
export class ReportingController {
  constructor(private readonly service: ReportingService) {}

  @Get('overview')
  overview(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.overview(organizationScopedQuery(query, request));
  }

  @Get('sales-funnel')
  salesFunnel(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.salesFunnel(organizationScopedQuery(query, request));
  }

  @Get('operations')
  operations(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.operations(organizationScopedQuery(query, request));
  }

  @Get('finance')
  finance(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.finance(organizationScopedQuery(query, request));
  }
}
