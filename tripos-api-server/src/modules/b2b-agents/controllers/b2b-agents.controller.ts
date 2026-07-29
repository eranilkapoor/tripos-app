import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CreateB2BAgentDto } from '../dto/b2b-agent.dto';
import { B2BAgentsService } from '../services/b2b-agents.service';

@ApiTags('b2b-agents')
@Controller('b2b-agents')
export class B2BAgentsController {
  constructor(private readonly service: B2BAgentsService) {}
  @Post() create(@Body() dto: CreateB2BAgentDto) { return this.service.create(dto); }
  @Get() list(@Query() query: CrmListQueryDto) { return this.service.list(query); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body() dto: StatusUpdateDto) { return this.service.updateStatus(id, dto); }
}
