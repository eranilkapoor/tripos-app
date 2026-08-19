import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BatchJobsService } from '../services/batch-jobs.service';

@ApiTags('batch-jobs')
@Controller('batch-jobs')
export class BatchJobsController {
  constructor(private readonly service: BatchJobsService) {}

  @Get()
  list() {
    return this.service.listJobs();
  }

  @Post('run')
  runAll() {
    return this.service.runAll();
  }

  @Post(':name/run')
  runOne(@Param('name') name: string) {
    return this.service.runOne(name);
  }
}
