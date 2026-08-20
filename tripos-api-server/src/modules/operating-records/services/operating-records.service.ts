import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CreateOperatingRecordDto } from '../dto/operating-record.dto';
import { OperatingRecord } from '../schemas/operating-record.schema';

@Injectable()
export class OperatingRecordsService {
  constructor(
    @InjectModel(OperatingRecord.name)
    private readonly model: Model<OperatingRecord>,
  ) {}

  create(moduleKey: string, dto: CreateOperatingRecordDto) {
    return this.model.create({ ...dto, moduleKey });
  }

  list(moduleKey: string, query: CrmListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter = this.filter(moduleKey, query);
    if (query.status) filter.status = query.status;
    if (query.search) {
      const search = new RegExp(escapeRegex(query.search), 'i');
      filter.$or = [
        { title: search },
        { code: search },
        { category: search },
        { entityType: search },
        { entityId: search },
        { ownerId: search },
      ];
    }
    return Promise.all([
      this.model
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]).then(([items, total]) => ({ items, total, page, limit }));
  }

  async findOne(moduleKey: string, id: string, query: CrmListQueryDto) {
    const item = await this.model
      .findOne(this.filter(moduleKey, query, { _id: id }))
      .lean()
      .exec();
    if (!item) throw new NotFoundException('Operating record not found');
    return item;
  }

  async update(
    moduleKey: string,
    id: string,
    dto: Partial<CreateOperatingRecordDto>,
    query: CrmListQueryDto,
  ) {
    const item = await this.model
      .findOneAndUpdate(
        this.filter(moduleKey, query, { _id: id }),
        { ...dto, moduleKey },
        { returnDocument: 'after' },
      )
      .exec();
    if (!item) throw new NotFoundException('Operating record not found');
    return item;
  }

  updateStatus(
    moduleKey: string,
    id: string,
    dto: StatusUpdateDto,
    query: CrmListQueryDto,
  ) {
    return this.update(moduleKey, id, { status: dto.status }, query);
  }

  async remove(moduleKey: string, id: string, query: CrmListQueryDto) {
    const item = await this.model
      .findOneAndDelete(this.filter(moduleKey, query, { _id: id }))
      .lean()
      .exec();
    if (!item) throw new NotFoundException('Operating record not found');
    return { deleted: true, id };
  }

  private filter(
    moduleKey: string,
    query: CrmListQueryDto,
    extra: Record<string, unknown> = {},
  ) {
    const filter: Record<string, unknown> = {
      ...extra,
      moduleKey,
      organizationId: query.organizationId ?? 'demo-org',
    };
    if (query.branchId) filter.branchId = query.branchId;
    return filter;
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
