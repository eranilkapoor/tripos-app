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
import { CreateCommunicationDto } from '../dto/communication.dto';
import { Communication } from '../schemas/communication.schema';

@Injectable()
export class CommunicationsService {
  constructor(
    @InjectModel(Communication.name)
    private readonly model: Model<Communication>,
  ) {}
  create(dto: CreateCommunicationDto) {
    return this.model.create(dto);
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, [
      'recipient',
      'recipientName',
      'subject',
      'templateCode',
      'channel',
    ]);
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(
      this.model,
      id,
      query,
      'Communication not found',
    );
  }
  update(
    id: string,
    dto: Partial<CreateCommunicationDto>,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      dto,
      'Communication not found',
    );
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Communication not found',
    );
  }
  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(
      this.model,
      id,
      query,
      'Communication not found',
    );
  }
}
