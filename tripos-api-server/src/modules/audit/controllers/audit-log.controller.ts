import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../../common/decorators/roles.decorator';
import { organizationScopedQuery } from '../../../common/utils/organization-scope.util';
import { AuditLogQueryDto } from '../dto/audit-log-query.dto';
import { AuditLogService } from '../services/audit-log.service';

@ApiTags('audit')
@Roles('platform_admin', 'organization_admin')
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly service: AuditLogService) {}

  @Get()
  list(@Query() query: AuditLogQueryDto, @Req() request: Request) {
    return this.service.list(organizationScopedQuery(query, request));
  }

  @Get('export.csv')
  async exportCsv(@Query() query: AuditLogQueryDto, @Req() request: Request) {
    return {
      fileName: `tripos-audit-${new Date().toISOString().slice(0, 10)}.csv`,
      contentType: 'text/csv',
      content: await this.service.exportCsv(
        organizationScopedQuery(query, request),
      ),
    };
  }
}
