import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { tenantScopedQuery } from '../../../common/utils/tenant-scope.util';
import { CreateQuotationDto } from '../dto/quotation.dto';
import { QuotationsService } from '../services/quotations.service';

@ApiTags('quotations')
@Controller('quotations')
export class QuotationsController {
  constructor(private readonly service: QuotationsService) {}
  @Post() create(@Body() dto: CreateQuotationDto) {
    return this.service.create(dto);
  }
  @Get()
  list(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.list(tenantScopedQuery(query, request));
  }
  @Get(':id') findOne(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findOne(id, tenantScopedQuery(query, request));
  }
  @Patch(':id/status') updateStatus(
    @Param('id') id: string,
    @Body() dto: StatusUpdateDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateStatus(
      id,
      dto,
      tenantScopedQuery(query, request),
    );
  }

  @Post(':id/calculate')
  calculate(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.calculate(id, tenantScopedQuery(query, request));
  }

  @Post(':id/send')
  send(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.send(id, tenantScopedQuery(query, request));
  }

  @Post(':id/accept')
  accept(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.accept(id, tenantScopedQuery(query, request));
  }

  @Post(':id/pdf')
  pdf(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.pdf(id, tenantScopedQuery(query, request));
  }
}
