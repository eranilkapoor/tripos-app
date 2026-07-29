import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { tenantScopedQuery } from '../../../common/utils/tenant-scope.util';
import {
  CreateSavedReportDto,
  RunDueSavedReportsDto,
  RunSavedReportDto,
} from '../dto/saved-report.dto';
import { SavedReportsService } from '../saved-reports.service';

type TenantRequest = Request & {
  user?: { tenantId?: unknown; branchId?: unknown };
};

@ApiTags('saved-reports')
@Controller('saved-reports')
export class SavedReportsController {
  constructor(private readonly service: SavedReportsService) {}

  @Post()
  create(@Body() dto: CreateSavedReportDto, @Req() request: TenantRequest) {
    return this.service.create({
      ...dto,
      organizationId: String(request.user?.tenantId ?? dto.organizationId),
      branchId: String(request.user?.branchId ?? dto.branchId ?? ''),
    });
  }

  @Get()
  list(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.list(tenantScopedQuery(query, request));
  }

  @Post('run-due')
  runDue(
    @Body() dto: RunDueSavedReportsDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.runDue(dto, tenantScopedQuery(query, request));
  }

  @Post(':id/run')
  run(
    @Param('id') id: string,
    @Body() dto: RunSavedReportDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.run(id, dto, tenantScopedQuery(query, request));
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: StatusUpdateDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateStatus(
      id,
      dto,
      tenantScopedQuery(query, request),
    );
  }
}
