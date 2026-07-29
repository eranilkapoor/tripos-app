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
import { tenantScopedQuery } from '../../../common/utils/tenant-scope.util';
import {
  AssignLeadDto,
  CreateLeadDto,
  LeadListQueryDto,
  UpdateLeadStageDto,
} from '../dto/leads.dto';
import { LeadsService } from '../services/leads.service';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Get()
  list(@Query() query: LeadListQueryDto, @Req() request: Request) {
    return this.leadsService.list(tenantScopedQuery(query, request));
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() query: LeadListQueryDto,
    @Req() request: Request,
  ) {
    return this.leadsService.findOne(id, tenantScopedQuery(query, request));
  }

  @Patch(':id/assign')
  assign(
    @Param('id') id: string,
    @Body() dto: AssignLeadDto,
    @Query() query: LeadListQueryDto,
    @Req() request: Request,
  ) {
    return this.leadsService.assign(id, dto, tenantScopedQuery(query, request));
  }

  @Patch(':id/stage')
  updateStage(
    @Param('id') id: string,
    @Body() dto: UpdateLeadStageDto,
    @Query() query: LeadListQueryDto,
    @Req() request: Request,
  ) {
    return this.leadsService.updateStage(
      id,
      dto,
      tenantScopedQuery(query, request),
    );
  }
}
