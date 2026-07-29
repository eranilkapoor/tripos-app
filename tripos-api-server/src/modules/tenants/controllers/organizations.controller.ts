import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { TenantsService } from '../services/tenants.service';

type TenantRequest = Request & {
  user?: { tenantId?: unknown };
};

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly service: TenantsService) {}

  @Get('current')
  current(@Req() request: TenantRequest) {
    return this.service.findOne(String(request.user?.tenantId ?? ''));
  }

  @Patch('current')
  updateCurrent(
    @Body() dto: Record<string, unknown>,
    @Req() request: TenantRequest,
  ) {
    return this.service.update(String(request.user?.tenantId ?? ''), dto);
  }
}
