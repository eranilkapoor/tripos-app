import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import {
  findScopedCrmRecord,
  listCrmRecords,
  updateScopedCrmRecord,
} from '../../../common/utils/crm-list.util';
import { Quotation } from '../../quotations/schemas/quotation.schema';
import {
  AddBookingPassengerDto,
  AddBookingPaymentScheduleDto,
  AddBookingVoucherDto,
  ConvertQuotationToBookingDto,
  CreateBookingDto,
} from '../dto/booking.dto';
import { Booking } from '../schemas/booking.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly model: Model<Booking>,
    @InjectModel(Quotation.name)
    private readonly quotationModel: Model<Quotation>,
  ) {}
  create(dto: CreateBookingDto) {
    return this.model.create({
      ...dto,
      passengers: dto.passengers ?? [],
      services: dto.services ?? [],
      documents: dto.documents ?? [],
      paymentSchedule: [],
      vouchers: [],
    });
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, [
      'customerName',
      'destination',
      'travelDates',
    ]);
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'Booking not found');
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Booking not found',
    );
  }

  async convertFromQuotation(
    quotationId: string,
    dto: ConvertQuotationToBookingDto,
    query: CrmListQueryDto,
  ) {
    const quotation = await this.quotationModel
      .findOne({
        _id: quotationId,
        organizationId: query.organizationId ?? 'demo-org',
        ...(query.branchId ? { branchId: query.branchId } : {}),
      })
      .lean()
      .exec();
    if (!quotation) throw new NotFoundException('Quotation not found');
    const booking = await this.model.create({
      organizationId: quotation.organizationId,
      branchId: quotation.branchId,
      quotationId,
      leadId: quotation.leadId,
      customerName: quotation.customerName,
      destination: quotation.destination,
      travelDates: quotation.travelDates,
      passengers: dto.passengers ?? [],
      services: dto.services ?? quotation.services ?? [],
      documents: dto.documents ?? [],
      paymentSchedule: [
        {
          label: 'Customer receivable',
          amount:
            quotation.pricing?.total ?? quotation.pricing?.grandTotal ?? 0,
          currencyCode: 'INR',
          status: 'pending',
        },
      ],
      vouchers: [],
      status: dto.status ?? 'pending_payment',
    });
    await this.quotationModel
      .updateOne({ _id: quotationId }, { status: 'accepted' })
      .exec();
    return booking;
  }

  appendPassenger(
    id: string,
    dto: AddBookingPassengerDto,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { $push: { passengers: { ...dto, addedAt: new Date().toISOString() } } },
      'Booking not found',
    );
  }

  appendPaymentSchedule(
    id: string,
    dto: AddBookingPaymentScheduleDto,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        $push: {
          paymentSchedule: {
            ...dto,
            currencyCode: dto.currencyCode ?? 'INR',
            status: dto.status ?? 'pending',
          },
        },
      },
      'Booking not found',
    );
  }

  appendVoucher(id: string, dto: AddBookingVoucherDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        $push: {
          vouchers: {
            ...dto,
            status: dto.status ?? 'issued',
            issuedAt: new Date().toISOString(),
          },
        },
      },
      'Booking not found',
    );
  }
}
