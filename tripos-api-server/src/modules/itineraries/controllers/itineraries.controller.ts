import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CreateItineraryDto } from '../dto/itinerary.dto';
import { ItinerariesService } from '../services/itineraries.service';

@ApiTags('itineraries')
@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly service: ItinerariesService) {}
  @Post() create(@Body() dto: CreateItineraryDto) { return this.service.create(dto); }
  @Get() list() { return this.service.list(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body() dto: StatusUpdateDto) { return this.service.updateStatus(id, dto); }
}

