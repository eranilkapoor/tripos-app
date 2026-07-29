import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { tenantScopedQuery } from '../../../common/utils/tenant-scope.util';
import { CreateStoredFileDto } from '../dto/storage.dto';
import { StorageService } from '../services/storage.service';

type TenantRequest = Request & {
  user?: { tenantId?: unknown; branchId?: unknown };
};

@ApiTags('storage')
@Controller('storage/files')
export class StorageController {
  constructor(private readonly service: StorageService) {}

  @Post('upload-intent')
  createUploadIntent(
    @Body() dto: CreateStoredFileDto,
    @Req() request: TenantRequest,
  ) {
    return this.service.createUploadIntent({
      ...dto,
      organizationId: String(request.user?.tenantId ?? dto.organizationId),
      branchId: String(request.user?.branchId ?? dto.branchId ?? ''),
    });
  }

  @Get()
  list(
    @Query()
    query: CrmListQueryDto & { entityType?: string; entityId?: string },
    @Req() request: Request,
  ) {
    return this.service.list(tenantScopedQuery(query, request));
  }
}
