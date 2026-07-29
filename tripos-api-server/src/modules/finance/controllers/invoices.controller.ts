import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { tenantScopedQuery } from '../../../common/utils/tenant-scope.util';
import { CreateInvoiceDto } from '../dto/invoice.dto';
import { InvoicesService } from '../services/invoices.service';

@ApiTags('finance-invoices')
@Controller('finance/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  list(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.invoicesService.list(tenantScopedQuery(query, request));
  }

  @Get('next-number/:series')
  nextInvoiceNumber(
    @Param('series') series: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.invoicesService.nextInvoiceNumber(
      series,
      tenantScopedQuery(query, request),
    );
  }

  @Post()
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoicesService.create(dto);
  }
}
