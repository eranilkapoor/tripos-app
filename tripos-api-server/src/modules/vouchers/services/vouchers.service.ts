import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import {
  deleteScopedCrmRecord,
  findScopedCrmRecord,
  listCrmRecords,
  updateScopedCrmRecord,
} from '../../../common/utils/crm-list.util';
import { buildDocumentTemplate } from '../../../common/utils/document-template.util';
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
  update(id: string, dto: Partial<CreateVoucherDto>, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      dto,
      'Voucher not found',
    );
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
  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(this.model, id, query, 'Voucher not found');
  }

  async document(id: string, query: CrmListQueryDto) {
    const voucher = await this.findOne(id, query);
    return buildDocumentTemplate({
      type: 'voucher',
      title: `Voucher ${String((voucher as { voucherType?: string }).voucherType ?? id)}`,
      fileName: `voucher-${id}.pdf`,
      organizationId: (voucher as { organizationId?: string }).organizationId,
      branchId: (voucher as { branchId?: string }).branchId,
      sections: [
        {
          heading: 'Voucher',
          rows: [
            {
              bookingId: (voucher as { bookingId?: string }).bookingId,
              customer: (voucher as { customerName?: string }).customerName,
              type: (voucher as { voucherType?: string }).voucherType,
              supplier: (voucher as { supplierName?: string }).supplierName,
              confirmationNumber: (voucher as { confirmationNumber?: string })
                .confirmationNumber,
              status: (voucher as { status?: string }).status,
            },
          ],
        },
        {
          heading: 'Line Items',
          rows:
            (voucher as { lineItems?: Array<Record<string, unknown>> })
              .lineItems ?? [],
        },
      ],
    });
  }
}
