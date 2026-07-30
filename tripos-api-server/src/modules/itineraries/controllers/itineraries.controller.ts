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
  organizationScopedBody,
  organizationScopedQuery,
} from '../../../common/utils/organization-scope.util';
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
    @Body() dto: Partial<CreateItineraryDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.update(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }
  @Post(':id/pdf')
  document(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.document(id, organizationScopedQuery(query, request));
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

  @Post(':id/days')
  addDay(
    @Param('id') id: string,
    @Body() dto: UpsertItineraryDayDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.addDay(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
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
      organizationScopedQuery(query, request),
    );
  }

  @Post(':id/items')
  addItem(
    @Param('id') id: string,
    @Body() dto: UpsertItineraryItemDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.addItem(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }
}
