import { Model } from 'mongoose';
import { CrmListQueryDto } from '../dto/crm-list-query.dto';

export async function listCrmRecords<T>(
  model: Model<T>,
  query: CrmListQueryDto,
  searchFields: string[],
  defaultSort: Record<string, 1 | -1> = { updatedAt: -1 },
) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const filter: Record<string, unknown> = {};
  filter.organizationId = query.organizationId ?? 'demo-org';
  if (query.branchId) filter.branchId = query.branchId;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = searchFields.map((field) => ({
      [field]: new RegExp(escapeRegex(query.search ?? ''), 'i'),
    }));
  }
  const [items, total] = await Promise.all([
    model.find(filter).sort(defaultSort).skip((page - 1) * limit).limit(limit).lean().exec(),
    model.countDocuments(filter).exec(),
  ]);
  return { items, total, page, limit };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
