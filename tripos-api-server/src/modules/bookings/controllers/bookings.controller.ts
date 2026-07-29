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
import {
  AddBookingPassengerDto,
  AddBookingPaymentScheduleDto,
  AddBookingVoucherDto,
  ConvertQuotationToBookingDto,
  CreateBookingDto,
} from '../dto/booking.dto';
import { BookingsService } from '../services/bookings.service';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly service: BookingsService) {}
  @Post() create(@Body() dto: CreateBookingDto) {
    return this.service.create(dto);
  }
  @Post('from-quotation/:quotationId')
  convertFromQuotation(
    @Param('quotationId') quotationId: string,
    @Body() dto: ConvertQuotationToBookingDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.convertFromQuotation(
      quotationId,
      dto,
      tenantScopedQuery(query, request),
    );
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
  @Post(':id/passengers')
  addPassenger(
    @Param('id') id: string,
    @Body() dto: AddBookingPassengerDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.appendPassenger(
      id,
      dto,
      tenantScopedQuery(query, request),
    );
  }
  @Post(':id/payments')
  addPaymentSchedule(
    @Param('id') id: string,
    @Body() dto: AddBookingPaymentScheduleDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.appendPaymentSchedule(
      id,
      dto,
      tenantScopedQuery(query, request),
    );
  }
  @Post(':id/vouchers')
  addVoucher(
    @Param('id') id: string,
    @Body() dto: AddBookingVoucherDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.appendVoucher(
      id,
      dto,
      tenantScopedQuery(query, request),
    );
  }
}
