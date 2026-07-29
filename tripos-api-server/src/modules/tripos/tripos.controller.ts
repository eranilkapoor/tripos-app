import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRecordDto } from './create-record.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CreateDemoLeadDto } from './create-demo-lead.dto';
import { CreateInvoiceDto } from './create-invoice.dto';
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
  dashboard() {
    return this.triposService.dashboard();
  }

  @Get('modules')
  modules() {
    return this.triposService.modules();
  }

  @Get('records')
  records() {
    return this.triposService.records();
  }

  @Get('records/:moduleKey')
  recordsByModule(@Param('moduleKey') moduleKey: string) {
    return this.triposService.records(moduleKey);
  }

  @Post('records')
  createRecord(@Body() dto: CreateRecordDto) {
    return this.triposService.createRecord(dto);
  }

  @Get('leads')
  leads() {
    return this.triposService.leads();
  }

  @Get('quotations')
  quotations() {
    return this.triposService.quotations();
  }

  @Get('bookings')
  bookings() {
    return this.triposService.bookings();
  }

  @Get('operations')
  operations() {
    return this.triposService.operations();
  }

  @Get('b2b-agents')
  b2bAgents() {
    return this.triposService.b2bAgents();
  }

  @Get('suppliers')
  suppliers() {
    return this.triposService.suppliers();
  }

  @Get('finance')
  finance() {
    return this.triposService.finance();
  }

  @Post('demo-leads')
  createDemoLead(@Body() dto: CreateDemoLeadDto) {
    return this.triposService.createDemoLead(dto);
  }

  @Get('invoices')
  invoices() {
    return this.triposService.invoices();
  }

  @Get('invoices/next-number/:series')
  nextInvoiceNumber(@Param('series') series: string) {
    return this.triposService.nextInvoiceNumber(series);
  }

  @Post('invoices')
  createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.triposService.createInvoice(dto);
  }
}
