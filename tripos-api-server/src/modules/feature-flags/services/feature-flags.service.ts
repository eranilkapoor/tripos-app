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
import { CreateFeatureFlagDto } from '../dto/feature-flag.dto';
import { FeatureFlag } from '../schemas/feature-flag.schema';

@Injectable()
export class FeatureFlagsService {
  constructor(
    @InjectModel(FeatureFlag.name) private readonly model: Model<FeatureFlag>,
  ) {}
  create(dto: CreateFeatureFlagDto) {
    return this.model.create({ ...dto, key: dto.key.toLowerCase() });
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, ['key', 'label', 'category']);
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'Feature flag not found');
  }
  update(
    id: string,
    dto: Partial<CreateFeatureFlagDto>,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      dto.key ? { ...dto, key: dto.key.toLowerCase() } : dto,
      'Feature flag not found',
    );
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Feature flag not found',
    );
  }
  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(
      this.model,
      id,
      query,
      'Feature flag not found',
    );
  }
}
