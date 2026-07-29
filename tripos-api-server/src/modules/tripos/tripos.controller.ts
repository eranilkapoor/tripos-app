import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { TriposService } from './tripos.service';
import { CrmListQueryDto } from '../../common/dto/crm-list-query.dto';

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
  dashboard(@Query() query: CrmListQueryDto) {
    return this.triposService.dashboard(query);
  }

  @Get('modules')
  modules() {
    return this.triposService.modules();
  }
}
