import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CreatePaymentDto } from '../dto/payment.dto';
import { PaymentsService } from '../services/payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}
  @Post() create(@Body() dto: CreatePaymentDto) { return this.service.create(dto); }
  @Get() list(@Query() query: CrmListQueryDto) { return this.service.list(query); }
  @Get('summary') summary() { return this.service.summary(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body() dto: StatusUpdateDto) { return this.service.updateStatus(id, dto); }
}
