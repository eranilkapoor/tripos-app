import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTenantDto } from '../dto/tenant.dto';
import { Tenant } from '../schemas/tenant.schema';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name) private readonly model: Model<Tenant>,
  ) {}

  create(dto: CreateTenantDto) {
    return this.model.create({
      ...dto,
      code: dto.code.toUpperCase(),
      branches: dto.branches?.length ? dto.branches : undefined,
      syncPolicy: dto.syncPolicy ?? undefined,
    });
  }

  list() {
    return this.model.find().sort({ name: 1 }).lean().exec();
  }

  async findOne(id: string) {
    const tenant = await this.model.findById(id).lean().exec();
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async findByCode(code: string) {
    return this.model.findOne({ code: code.toUpperCase() }).lean().exec();
  }

  async update(id: string, dto: Record<string, unknown>) {
    const tenant = await this.model
      .findByIdAndUpdate(
        id,
        {
          $set: sanitizeTenantUpdate(dto),
        },
        { new: true },
      )
      .lean()
      .exec();
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async remove(id: string) {
    const tenant = await this.model
      .findByIdAndUpdate(id, { status: 'inactive' }, { new: true })
      .lean()
      .exec();
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async ensureDemoTenant() {
    const existing = await this.model.findOne({ code: 'WEBNZA' }).exec();
    if (existing) return existing;
    return this.model.create({
      name: 'Webnza Travels Demo',
      code: 'WEBNZA',
      dataHostingMode: 'tripos_cloud',
      branches: [
        { id: 'delhi', name: 'Delhi HQ', city: 'Delhi' },
        { id: 'dubai', name: 'Dubai Desk', city: 'Dubai' },
      ],
      syncPolicy: {
        syncMode: 'realtime',
        offlineWindowHours: 24,
        customerManagedStorage: false,
      },
    });
  }
}

function sanitizeTenantUpdate(dto: Record<string, unknown>) {
  const allowed = ['name', 'dataHostingMode', 'branches', 'syncPolicy'];
  return Object.fromEntries(
    Object.entries(dto).filter(([key]) => allowed.includes(key)),
  );
}
