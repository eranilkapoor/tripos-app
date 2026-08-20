import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrganizationDto } from '../dto/organization.dto';
import { Organization } from '../schemas/organization.schema';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name) private readonly model: Model<Organization>,
  ) {}

  create(dto: CreateOrganizationDto) {
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
    const organization = await this.findByIdOrCode(id);
    if (!organization) throw new NotFoundException('Organization not found');
    return organization;
  }

  async findByCode(code: string) {
    return this.model.findOne({ code: code.toUpperCase() }).lean().exec();
  }

  async update(id: string, dto: Record<string, unknown>) {
    const organization = await this.model
      .findByIdAndUpdate(
        id,
        {
          $set: sanitizeOrganizationUpdate(dto),
        },
        { returnDocument: 'after' },
      )
      .lean()
      .exec();
    if (!organization) throw new NotFoundException('Organization not found');
    return organization;
  }

  async remove(id: string) {
    return this.updateStatus(id, 'inactive');
  }

  async updateStatus(id: string, status: string) {
    const organization = await this.model
      .findByIdAndUpdate(id, { status }, { returnDocument: 'after' })
      .lean()
      .exec();
    if (!organization) throw new NotFoundException('Organization not found');
    return organization;
  }

  async ensureDemoOrganization() {
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

  private findByIdOrCode(idOrCode: string) {
    if (Types.ObjectId.isValid(idOrCode)) {
      return this.model.findById(idOrCode).lean().exec();
    }
    const code = idOrCode === 'demo-org' ? 'WEBNZA' : idOrCode;
    return this.model.findOne({ code: code.toUpperCase() }).lean().exec();
  }
}

function sanitizeOrganizationUpdate(dto: Record<string, unknown>) {
  const allowed = [
    'name',
    'dataHostingMode',
    'branches',
    'syncPolicy',
    'billingProfile',
    'subscription',
    'branding',
    'compliance',
    'securityPolicy',
    'integrations',
    'metadata',
  ];
  return Object.fromEntries(
    Object.entries(dto).filter(([key]) => allowed.includes(key)),
  );
}
