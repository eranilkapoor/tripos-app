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
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import {
  tenantScopedBody,
  tenantScopedQuery,
} from '../../../common/utils/tenant-scope.util';
import {
  CreateItineraryDto,
  UpsertItineraryDayDto,
  UpsertItineraryItemDto,
} from '../dto/itinerary.dto';
import { ItinerariesService } from '../services/itineraries.service';

@ApiTags('itineraries')
@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly service: ItinerariesService) {}
  @Post() create(@Body() dto: CreateItineraryDto, @Req() request: Request) {
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
    @Body() dto: Partial<CreateItineraryDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.update(id, dto, tenantScopedQuery(query, request));
  }
  @Post(':id/pdf')
  document(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.document(id, tenantScopedQuery(query, request));
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

  @Post(':id/days')
  addDay(
    @Param('id') id: string,
    @Body() dto: UpsertItineraryDayDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.addDay(id, dto, tenantScopedQuery(query, request));
  }

  @Patch(':id/days/:dayId')
  updateDay(
    @Param('id') id: string,
    @Param('dayId') dayId: string,
    @Body() dto: UpsertItineraryDayDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateDay(
      id,
      dayId,
      dto,
      tenantScopedQuery(query, request),
    );
  }

  @Post(':id/items')
  addItem(
    @Param('id') id: string,
    @Body() dto: UpsertItineraryItemDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.addItem(id, dto, tenantScopedQuery(query, request));
  }
}
