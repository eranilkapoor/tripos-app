import {
  BadRequestException,
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
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import {
  organizationScopedBody,
  organizationScopedQuery,
} from '../../../common/utils/organization-scope.util';
import { CreateOperatingRecordDto } from '../dto/operating-record.dto';
import { OperatingRecordsService } from '../services/operating-records.service';

const MODULE_KEYS = [
  'contacts',
  'activities',
  'follow-ups',
  'meetings',
  'notes',
  'service-catalog',
  'custom-fields',
  'call-center',
  'field-force',
  'content',
  'analytics',
];

@ApiTags('operating-records')
@Controller('operating-records')
export class OperatingRecordsController {
  constructor(private readonly service: OperatingRecordsService) {}

  @Post(':moduleKey')
  create(
    @Param('moduleKey') moduleKey: string,
    @Body() dto: CreateOperatingRecordDto,
    @Req() request: Request,
  ) {
    assertModuleKey(moduleKey);
    return this.service.create(moduleKey, organizationScopedBody(dto, request));
  }

  @Get(':moduleKey')
  list(
    @Param('moduleKey') moduleKey: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    assertModuleKey(moduleKey);
    return this.service.list(
      moduleKey,
      organizationScopedQuery(query, request),
    );
  }

  @Get(':moduleKey/:id')
  findOne(
    @Param('moduleKey') moduleKey: string,
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    assertModuleKey(moduleKey);
    return this.service.findOne(
      moduleKey,
      id,
      organizationScopedQuery(query, request),
    );
  }

  @Patch(':moduleKey/:id')
  update(
    @Param('moduleKey') moduleKey: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateOperatingRecordDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    assertModuleKey(moduleKey);
    return this.service.update(
      moduleKey,
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Patch(':moduleKey/:id/status')
  updateStatus(
    @Param('moduleKey') moduleKey: string,
    @Param('id') id: string,
    @Body() dto: StatusUpdateDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    assertModuleKey(moduleKey);
    return this.service.updateStatus(
      moduleKey,
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Delete(':moduleKey/:id')
  remove(
    @Param('moduleKey') moduleKey: string,
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    assertModuleKey(moduleKey);
    return this.service.remove(
      moduleKey,
      id,
      organizationScopedQuery(query, request),
    );
  }
}

function assertModuleKey(moduleKey: string) {
  if (!MODULE_KEYS.includes(moduleKey)) {
    throw new BadRequestException('Unsupported operating module');
  }
}
