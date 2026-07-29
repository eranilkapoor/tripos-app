import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { CreateLeadDto } from '../dto/leads.dto';
import { LeadsService } from '../services/leads.service';

@ApiTags('public-leads')
@Public()
@Controller('public/leads')
export class PublicLeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create({
      ...dto,
      source: dto.source || 'public-website',
      channel: dto.channel || 'b2c',
    });
  }
}
