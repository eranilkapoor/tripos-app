import { NotFoundException } from '@nestjs/common';
import { Model, UpdateQuery } from 'mongoose';
import { CrmListQueryDto } from '../dto/crm-list-query.dto';

export async function listCrmRecords<T>(
  model: Model<T>,
  query: CrmListQueryDto,
  searchFields: string[],
  defaultSort: Record<string, 1 | -1> = { updatedAt: -1 },
) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const filter = scopeFilter(query);
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = searchFields.map((field) => ({
      [field]: new RegExp(escapeRegex(query.search ?? ''), 'i'),
    }));
  }
  const [items, total] = await Promise.all([
    model
      .find(filter)
      .sort(defaultSort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec(),
    model.countDocuments(filter).exec(),
  ]);
  return { items, total, page, limit };
}

export function scopeFilter(
  query: CrmListQueryDto,
  extra: Record<string, unknown> = {},
) {
  const filter: Record<string, unknown> = {
    ...extra,
    organizationId: query.organizationId ?? 'demo-org',
  };
  if (query.branchId) filter.branchId = query.branchId;
  return filter;
}

export async function findScopedCrmRecord<T>(
  model: Model<T>,
  id: string,
  query: CrmListQueryDto,
  notFoundMessage: string,
) {
  const item = await model
    .findOne(
      scopeFilter(query, { _id: id }) as unknown as Parameters<
        Model<T>['findOne']
      >[0],
    )
    .lean()
    .exec();
  if (!item) throw new NotFoundException(notFoundMessage);
  return item;
}

export async function updateScopedCrmRecord<T>(
  model: Model<T>,
  id: string,
  query: CrmListQueryDto,
  update: UpdateQuery<T>,
  notFoundMessage: string,
) {
  const item = await model
    .findOneAndUpdate(
      scopeFilter(query, { _id: id }) as unknown as Parameters<
        Model<T>['findOneAndUpdate']
      >[0],
      update,
      { new: true },
    )
    .exec();
  if (!item) throw new NotFoundException(notFoundMessage);
  return item;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
