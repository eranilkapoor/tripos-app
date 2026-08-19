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
import { CreateSettingDto } from '../dto/setting.dto';
import { Setting } from '../schemas/setting.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private readonly model: Model<Setting>,
  ) {}

  create(dto: CreateSettingDto) {
    return this.model.create(dto);
  }

  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, ['key', 'label', 'category']);
  }

  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'Setting not found');
  }

  update(id: string, dto: Partial<CreateSettingDto>, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      dto,
      'Setting not found',
    );
  }

  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Setting not found',
    );
  }

  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(this.model, id, query, 'Setting not found');
  }
}
