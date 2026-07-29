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
import { CreateSupportTicketDto } from '../dto/support-ticket.dto';
import { SupportTicket } from '../schemas/support-ticket.schema';

@Injectable()
export class SupportTicketsService {
  constructor(
    @InjectModel(SupportTicket.name)
    private readonly model: Model<SupportTicket>,
  ) {}
  create(dto: CreateSupportTicketDto) {
    return this.model.create(dto);
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, [
      'subject',
      'customerName',
      'bookingId',
      'channel',
      'assignedTo',
    ]);
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(
      this.model,
      id,
      query,
      'Support ticket not found',
    );
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Support ticket not found',
    );
  }
}
