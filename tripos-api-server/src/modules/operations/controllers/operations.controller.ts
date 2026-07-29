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
  tenantScopedBody,
  tenantScopedQuery,
} from '../../../common/utils/tenant-scope.util';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import {
  AddOperationTimelineEventDto,
  AssignOperationTaskDto,
  CreateOperationTaskDto,
  EscalateOperationTaskDto,
  UpdateOperationSlaDto,
} from '../dto/operation-task.dto';
import { OperationsService } from '../services/operations.service';

@ApiTags('operations')
@Controller('operations')
export class OperationsController {
  constructor(private readonly service: OperationsService) {}
  @Post() create(@Body() dto: CreateOperationTaskDto, @Req() request: Request) {
    return this.service.create(tenantScopedBody(dto, request));
  }
  @Get()
  list(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.list(tenantScopedQuery(query, request));
  }
  @Get(':id') findOne(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findOne(id, tenantScopedQuery(query, request));
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateOperationTaskDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.update(id, dto, tenantScopedQuery(query, request));
  }
  @Patch(':id/status') updateStatus(
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
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.remove(id, tenantScopedQuery(query, request));
  }

  @Patch(':id/assign')
  assign(
    @Param('id') id: string,
    @Body() dto: AssignOperationTaskDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.assign(id, dto, tenantScopedQuery(query, request));
  }

  @Patch(':id/sla')
  updateSla(
    @Param('id') id: string,
    @Body() dto: UpdateOperationSlaDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateSla(id, dto, tenantScopedQuery(query, request));
  }

  @Post(':id/escalations')
  escalate(
    @Param('id') id: string,
    @Body() dto: EscalateOperationTaskDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.escalate(id, dto, tenantScopedQuery(query, request));
  }

  @Post(':id/timeline')
  addTimelineEvent(
    @Param('id') id: string,
    @Body() dto: AddOperationTimelineEventDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.addTimelineEvent(
      id,
      dto,
      tenantScopedQuery(query, request),
    );
  }
}
