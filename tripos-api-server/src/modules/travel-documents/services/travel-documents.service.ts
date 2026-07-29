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
import { CreateTravelDocumentDto } from '../dto/travel-document.dto';
import { TravelDocument } from '../schemas/travel-document.schema';

@Injectable()
export class TravelDocumentsService {
  constructor(
    @InjectModel(TravelDocument.name)
    private readonly model: Model<TravelDocument>,
  ) {}
  create(dto: CreateTravelDocumentDto) {
    return this.model.create(dto);
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, [
      'customerName',
      'bookingId',
      'documentType',
      'documentNumber',
    ]);
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(
      this.model,
      id,
      query,
      'Travel document not found',
    );
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Travel document not found',
    );
  }
}
