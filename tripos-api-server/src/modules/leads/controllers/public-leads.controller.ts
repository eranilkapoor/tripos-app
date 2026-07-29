import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateLeadDto } from '../dto/leads.dto';
import { LeadsService } from '../services/leads.service';

@ApiTags('public-leads')
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

