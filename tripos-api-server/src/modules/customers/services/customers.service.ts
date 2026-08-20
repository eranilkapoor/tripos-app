import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import {
  deleteScopedCrmRecord,
  findScopedCrmRecord,
  listCrmRecords,
  updateScopedCrmRecord,
} from '../../../common/utils/crm-list.util';
import { CreateCustomerDto } from '../dto/customer.dto';
import { Customer } from '../schemas/customer.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private readonly model: Model<Customer>,
  ) {}
  create(dto: CreateCustomerDto) {
    return this.model.create(dto);
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, [
      'name',
      'email',
      'phone',
      'city',
      'country',
      'ownerId',
      'externalReference',
    ]);
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'Customer not found');
  }
  update(id: string, dto: Partial<CreateCustomerDto>, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      dto,
      'Customer not found',
    );
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Customer not found',
    );
  }
  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(this.model, id, query, 'Customer not found');
  }
}
