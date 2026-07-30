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
    return this.service.create(organizationScopedBody(dto, request));
  }
  @Get()
  list(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.list(organizationScopedQuery(query, request));
  }
  @Get(':id') findOne(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findOne(id, organizationScopedQuery(query, request));
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateOperationTaskDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.update(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
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

  @Patch(':id/assign')
  assign(
    @Param('id') id: string,
    @Body() dto: AssignOperationTaskDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.assign(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Patch(':id/sla')
  updateSla(
    @Param('id') id: string,
    @Body() dto: UpdateOperationSlaDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateSla(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Post(':id/escalations')
  escalate(
    @Param('id') id: string,
    @Body() dto: EscalateOperationTaskDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.escalate(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
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
      organizationScopedQuery(query, request),
    );
  }
}
