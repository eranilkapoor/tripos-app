import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { CreateItineraryDto } from '../dto/itinerary.dto';
import { ItinerariesService } from '../services/itineraries.service';

@ApiTags('itineraries')
@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly service: ItinerariesService) {}
  @Post() create(@Body() dto: CreateItineraryDto) { return this.service.create(dto); }
  @Get() list(@Query() query: CrmListQueryDto) { return this.service.list(query); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body() dto: StatusUpdateDto) { return this.service.updateStatus(id, dto); }
}
