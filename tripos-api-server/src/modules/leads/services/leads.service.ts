import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AssignLeadDto,
  AddLeadActivityDto,
  CreateLeadDto,
  LeadListQueryDto,
  UpdateLeadStageDto,
} from '../dto/leads.dto';
import { Lead, LeadActivity } from '../schemas/leads.schema';
import { scopeFilter } from '../../../common/utils/crm-list.util';
import {
  deleteScopedCrmRecord,
  updateScopedCrmRecord,
} from '../../../common/utils/crm-list.util';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<Lead>,
    @InjectModel(LeadActivity.name)
    private readonly activityModel: Model<LeadActivity>,
  ) {}

  async create(dto: CreateLeadDto) {
    const lead = await this.leadModel.create({
      ...dto,
      channel: dto.channel ?? 'b2c',
      source: dto.source || 'manual',
      requirement: dto.requirement ?? {},
      stage: dto.assignedTo ? 'assigned' : 'new',
      temperature: scoreTemperature(dto),
      score: scoreLead(dto),
    });
    await this.activityModel.create({
      leadId: String(lead._id),
      type: 'lead_created',
      subject: 'Lead created',
      metadata: { source: lead.source, channel: lead.channel },
    });
    return lead;
  }

  async list(query: LeadListQueryDto) {
    const filter: Record<string, unknown> = {
      organizationId: query.organizationId ?? 'demo-org',
    };
    if (query.branchId) filter.branchId = query.branchId;
    if (query.stage) filter.stage = query.stage;
    if (query.assignedTo) filter.assignedTo = query.assignedTo;
    if (query.destination) {
      filter['requirement.destination'] = new RegExp(query.destination, 'i');
    }
    if (query.search) {
      filter.$or = [
        { customerName: new RegExp(query.search, 'i') },
        { email: new RegExp(query.search, 'i') },
        { phone: new RegExp(query.search, 'i') },
      ];
    }
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [items, total] = await Promise.all([
      this.leadModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.leadModel.countDocuments(filter).exec(),
    ]);
    return { items, total, page, limit };
  }

  async findOne(id: string, query: LeadListQueryDto) {
    const lead = await this.leadModel
      .findOne(scopeFilter(query, { _id: id }))
      .lean()
      .exec();
    if (!lead) throw new NotFoundException('Lead not found');
    const activities = await this.activityModel
      .find({ leadId: id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return { lead, activities };
  }

  async assign(id: string, dto: AssignLeadDto, query: LeadListQueryDto) {
    const lead = await this.leadModel
      .findOneAndUpdate(
        scopeFilter(query, { _id: id }),
        { assignedTo: dto.assignedTo, stage: 'assigned' },
        { returnDocument: 'after' },
      )
      .exec();
    if (!lead) throw new NotFoundException('Lead not found');
    await this.activityModel.create({
      leadId: id,
      type: 'assignment_changed',
      subject: `Assigned to ${dto.assignedTo}`,
      metadata: { assignedTo: dto.assignedTo },
    });
    return lead;
  }

  async update(
    id: string,
    dto: Partial<CreateLeadDto>,
    query: LeadListQueryDto,
  ) {
    const update = {
      ...dto,
      ...(dto.requirement ? { requirement: dto.requirement } : {}),
      ...(dto.channel || dto.phone || dto.email || dto.requirement
        ? {
            temperature: scoreTemperature({ ...dto } as CreateLeadDto),
            score: scoreLead({ ...dto } as CreateLeadDto),
          }
        : {}),
    };
    const lead = await updateScopedCrmRecord(
      this.leadModel,
      id,
      query,
      update,
      'Lead not found',
    );
    await this.activityModel.create({
      organizationId: query.organizationId ?? 'demo-org',
      leadId: id,
      type: 'lead_updated',
      subject: 'Lead updated',
      metadata: { fields: Object.keys(dto) },
    });
    return lead;
  }

  async updateStage(
    id: string,
    dto: UpdateLeadStageDto,
    query: LeadListQueryDto,
  ) {
    const lead = await this.leadModel
      .findOneAndUpdate(
        scopeFilter(query, { _id: id }),
        { stage: dto.stage },
        { returnDocument: 'after' },
      )
      .exec();
    if (!lead) throw new NotFoundException('Lead not found');
    await this.activityModel.create({
      leadId: id,
      type: 'stage_changed',
      subject: `Moved to ${dto.stage}`,
      metadata: { stage: dto.stage },
    });
    return lead;
  }

  async activities(id: string, query: LeadListQueryDto) {
    await this.findOne(id, query);
    return this.activityModel
      .find({ organizationId: query.organizationId ?? 'demo-org', leadId: id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  remove(id: string, query: LeadListQueryDto) {
    return deleteScopedCrmRecord(this.leadModel, id, query, 'Lead not found');
  }

  async addActivity(
    id: string,
    dto: AddLeadActivityDto,
    query: LeadListQueryDto,
  ) {
    await this.findOne(id, query);
    return this.activityModel.create({
      organizationId: query.organizationId ?? 'demo-org',
      leadId: id,
      type: dto.type ?? 'note_added',
      subject: dto.subject,
      description: dto.description,
      metadata: dto.metadata ?? {},
    });
  }
}

function scoreLead(dto: CreateLeadDto) {
  let score = 20;
  if (dto.phone) score += 15;
  if (dto.email) score += 10;
  if (dto.requirement?.destination) score += 20;
  if (dto.requirement?.travelDate) score += 15;
  if (dto.requirement?.budget) score += 10;
  if (dto.channel === 'b2b') score += 10;
  return Math.min(score, 100);
}

function scoreTemperature(dto: CreateLeadDto) {
  const score = scoreLead(dto);
  if (score >= 75) return 'hot';
  if (score >= 45) return 'warm';
  return 'cold';
}
