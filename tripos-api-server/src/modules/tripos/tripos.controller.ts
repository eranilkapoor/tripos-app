import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { CrmListQueryDto } from '../../common/dto/crm-list-query.dto';
import { organizationScopedQuery } from '../../common/utils/organization-scope.util';
import { TriposService } from './tripos.service';

@ApiTags('tripos')
@Controller('tripos')
export class TriposController {
  constructor(private readonly triposService: TriposService) {}

  @Get('health')
  @Public()
  health() {
    return this.triposService.health();
  }

  @Get('dashboard')
  dashboard(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.triposService.dashboard(
      organizationScopedQuery(query, request),
    );
  }

  @Get('modules')
  modules() {
    return this.triposService.modules();
  }
}
