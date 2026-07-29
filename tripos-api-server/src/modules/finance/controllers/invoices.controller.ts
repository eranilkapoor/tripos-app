import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateInvoiceDto } from '../dto/invoice.dto';
import { InvoicesService } from '../services/invoices.service';

@ApiTags('finance-invoices')
@Controller('finance/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  list() {
    return this.invoicesService.list();
  }

  @Get('next-number/:series')
  nextInvoiceNumber(@Param('series') series: string) {
    return this.invoicesService.nextInvoiceNumber(series);
  }

  @Post()
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoicesService.create(dto);
  }
}

