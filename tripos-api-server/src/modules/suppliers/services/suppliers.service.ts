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
import { CreateSupplierDto } from '../dto/supplier.dto';
import { Supplier } from '../schemas/supplier.schema';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Supplier.name) private readonly model: Model<Supplier>,
  ) {}
  create(dto: CreateSupplierDto) {
    return this.model.create({
      ...dto,
      contacts: dto.contacts ?? [],
      contracts: dto.contracts ?? [],
      rates: dto.rates ?? [],
    });
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, ['name', 'type', 'destination']);
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'Supplier not found');
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Supplier not found',
    );
  }
}
