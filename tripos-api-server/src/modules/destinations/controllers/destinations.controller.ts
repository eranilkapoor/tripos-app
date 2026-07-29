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
import { CreateDestinationDto } from '../dto/destination.dto';
import { DestinationsService } from '../services/destinations.service';

@ApiTags('destinations')
@Controller('destinations')
export class DestinationsController {
  constructor(private readonly service: DestinationsService) {}
  @Post() create(@Body() dto: CreateDestinationDto, @Req() request: Request) {
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
    @Body() dto: Partial<CreateDestinationDto>,
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
}
