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
import { CreateTagDto } from '../dto/tag.dto';
import { Tag } from '../schemas/tag.schema';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private readonly model: Model<Tag>) {}

  create(dto: CreateTagDto) {
    return this.model.create(dto);
  }

  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, ['name', 'module', 'description']);
  }

  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'Tag not found');
  }

  update(id: string, dto: Partial<CreateTagDto>, query: CrmListQueryDto) {
    return updateScopedCrmRecord(this.model, id, query, dto, 'Tag not found');
  }

  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Tag not found',
    );
  }

  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(this.model, id, query, 'Tag not found');
  }
}
