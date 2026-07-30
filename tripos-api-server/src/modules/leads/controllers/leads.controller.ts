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
import {
  organizationScopedBody,
  organizationScopedQuery,
} from '../../../common/utils/organization-scope.util';
import {
  AssignLeadDto,
  AddLeadActivityDto,
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
  create(@Body() dto: CreateLeadDto, @Req() request: Request) {
    return this.leadsService.create(organizationScopedBody(dto, request));
  }

  @Get()
  list(@Query() query: LeadListQueryDto, @Req() request: Request) {
    return this.leadsService.list(organizationScopedQuery(query, request));
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() query: LeadListQueryDto,
    @Req() request: Request,
  ) {
    return this.leadsService.findOne(
      id,
      organizationScopedQuery(query, request),
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateLeadDto>,
    @Query() query: LeadListQueryDto,
    @Req() request: Request,
  ) {
    return this.leadsService.update(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Patch(':id/assign')
  assign(
    @Param('id') id: string,
    @Body() dto: AssignLeadDto,
    @Query() query: LeadListQueryDto,
    @Req() request: Request,
  ) {
    return this.leadsService.assign(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
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
      organizationScopedQuery(query, request),
    );
  }

  @Get(':id/activities')
  activities(
    @Param('id') id: string,
    @Query() query: LeadListQueryDto,
    @Req() request: Request,
  ) {
    return this.leadsService.activities(
      id,
      organizationScopedQuery(query, request),
    );
  }

  @Post(':id/notes')
  addNote(
    @Param('id') id: string,
    @Body() dto: AddLeadActivityDto,
    @Query() query: LeadListQueryDto,
    @Req() request: Request,
  ) {
    return this.leadsService.addActivity(
      id,
      { ...dto, type: 'note_added' },
      organizationScopedQuery(query, request),
    );
  }

  @Post(':id/activities')
  addActivity(
    @Param('id') id: string,
    @Body() dto: AddLeadActivityDto,
    @Query() query: LeadListQueryDto,
    @Req() request: Request,
  ) {
    return this.leadsService.addActivity(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query() query: LeadListQueryDto,
    @Req() request: Request,
  ) {
    return this.leadsService.remove(
      id,
      organizationScopedQuery(query, request),
    );
  }
}
