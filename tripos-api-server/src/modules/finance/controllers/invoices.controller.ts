import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import {
  tenantScopedBody,
  tenantScopedQuery,
} from '../../../common/utils/tenant-scope.util';
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
  create(@Body() dto: CreateInvoiceDto, @Req() request: Request) {
    return this.invoicesService.create(tenantScopedBody(dto, request));
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.invoicesService.findOne(id, tenantScopedQuery(query, request));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateInvoiceDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.invoicesService.update(
      id,
      dto,
      tenantScopedQuery(query, request),
    );
  }

  @Post(':id/pdf')
  document(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.invoicesService.document(id, tenantScopedQuery(query, request));
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.invoicesService.remove(id, tenantScopedQuery(query, request));
  }
}
