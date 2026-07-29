import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CreateTenantDto } from '../dto/tenant.dto';
import { TenantsService } from '../services/tenants.service';

@ApiTags('tenants')
@Roles('platform_admin')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly service: TenantsService) {}
  @Post() create(@Body() dto: CreateTenantDto) {
    return this.service.create(dto);
  }
  @Get() list() {
    return this.service.list();
  }
  @Get(':id') findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Patch(':id') update(
    @Param('id') id: string,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.service.update(id, dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
