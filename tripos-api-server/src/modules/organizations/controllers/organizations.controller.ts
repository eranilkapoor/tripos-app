import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CreateOrganizationDto } from '../dto/organization.dto';
import { OrganizationsService } from '../services/organizations.service';

type OrganizationRequest = Request & {
  user?: { organizationId?: unknown };
};

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Post()
  @Roles('platform_admin')
  create(@Body() dto: CreateOrganizationDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('platform_admin')
  list() {
    return this.service.list();
  }

  @Get('current')
  current(@Req() request: OrganizationRequest) {
    return this.service.findOne(String(request.user?.organizationId ?? ''));
  }

  @Patch('current')
  updateCurrent(
    @Body() dto: Record<string, unknown>,
    @Req() request: OrganizationRequest,
  ) {
    return this.service.update(String(request.user?.organizationId ?? ''), dto);
  }

  @Get(':id')
  @Roles('platform_admin')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('platform_admin')
  update(@Param('id') id: string, @Body() dto: Record<string, unknown>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('platform_admin')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
