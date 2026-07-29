import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import {
  findScopedCrmRecord,
  listCrmRecords,
  updateScopedCrmRecord,
} from '../../../common/utils/crm-list.util';
import { CreateVoucherDto } from '../dto/voucher.dto';
import { Voucher } from '../schemas/voucher.schema';

@Injectable()
export class VouchersService {
  constructor(
    @InjectModel(Voucher.name) private readonly model: Model<Voucher>,
  ) {}
  create(dto: CreateVoucherDto) {
    return this.model.create({ ...dto, lineItems: dto.lineItems ?? [] });
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, [
      'bookingId',
      'customerName',
      'voucherType',
      'supplierName',
      'confirmationNumber',
    ]);
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'Voucher not found');
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Voucher not found',
    );
  }
}
