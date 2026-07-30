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
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import {
  organizationScopedBody,
  organizationScopedQuery,
} from '../../../common/utils/organization-scope.util';
import { CreateStoredFileDto } from '../dto/storage.dto';
import { StorageService } from '../services/storage.service';

type OrganizationRequest = Request & {
  user?: { organizationId?: unknown; branchId?: unknown };
};

@ApiTags('storage')
@Controller('storage/files')
export class StorageController {
  constructor(private readonly service: StorageService) {}

  @Post('upload-intent')
  createUploadIntent(
    @Body() dto: CreateStoredFileDto,
    @Req() request: OrganizationRequest,
  ) {
    return this.service.createUploadIntent(
      organizationScopedBody(dto, request),
    );
  }

  @Get()
  list(
    @Query()
    query: CrmListQueryDto & { entityType?: string; entityId?: string },
    @Req() request: Request,
  ) {
    return this.service.list(organizationScopedQuery(query, request));
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findOne(id, organizationScopedQuery(query, request));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    dto: Partial<CreateStoredFileDto> & { status?: string; url?: string },
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.update(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.remove(id, organizationScopedQuery(query, request));
  }
}
