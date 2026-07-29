import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CreateTourPackageDto } from '../dto/tour-package.dto';
import { TourPackagesService } from '../services/tour-packages.service';

@ApiTags('tour-packages')
@Controller('tour-packages')
export class TourPackagesController {
  constructor(private readonly service: TourPackagesService) {}
  @Post() create(@Body() dto: CreateTourPackageDto) { return this.service.create(dto); }
  @Get() list(@Query() query: CrmListQueryDto) { return this.service.list(query); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body() dto: StatusUpdateDto) { return this.service.updateStatus(id, dto); }
}
