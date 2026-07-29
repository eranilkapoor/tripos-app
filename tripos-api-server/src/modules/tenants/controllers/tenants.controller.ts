import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTenantDto } from '../dto/tenant.dto';
import { TenantsService } from '../services/tenants.service';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly service: TenantsService) {}
  @Post() create(@Body() dto: CreateTenantDto) { return this.service.create(dto); }
  @Get() list() { return this.service.list(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
}
