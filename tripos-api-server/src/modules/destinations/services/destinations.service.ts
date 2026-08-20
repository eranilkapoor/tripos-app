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
import { CreateDestinationDto } from '../dto/destination.dto';
import { Destination } from '../schemas/destination.schema';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectModel(Destination.name) private readonly model: Model<Destination>,
  ) {}
  create(dto: CreateDestinationDto) {
    return this.model.create({
      ...dto,
      highlights: dto.highlights ?? [],
      tags: dto.tags ?? [],
    });
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(
      this.model,
      query,
      ['name', 'country', 'region', 'bestSeason', 'visaRequirement'],
      { country: 1, name: 1 },
    );
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'Destination not found');
  }
  update(
    id: string,
    dto: Partial<CreateDestinationDto>,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      dto,
      'Destination not found',
    );
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Destination not found',
    );
  }
  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(
      this.model,
      id,
      query,
      'Destination not found',
    );
  }
}
