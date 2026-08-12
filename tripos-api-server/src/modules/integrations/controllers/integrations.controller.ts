import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IntegrationsService } from '../services/integrations.service';

@ApiTags('integrations')
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly service: IntegrationsService) {}

  @Get('health')
  health() {
    return this.service.health();
  }

  @Post('smoke-tests')
  smokeTests() {
    return this.service.smokeTests();
  }
}
