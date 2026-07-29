import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CreateTravelDocumentDto } from '../dto/travel-document.dto';
import { TravelDocumentsService } from '../services/travel-documents.service';

@ApiTags('travel-documents')
@Controller('travel-documents')
export class TravelDocumentsController {
  constructor(private readonly service: TravelDocumentsService) {}
  @Post() create(@Body() dto: CreateTravelDocumentDto) { return this.service.create(dto); }
  @Get() list() { return this.service.list(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body() dto: StatusUpdateDto) { return this.service.updateStatus(id, dto); }
}
