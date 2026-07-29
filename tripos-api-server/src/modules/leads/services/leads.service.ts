import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AssignLeadDto,
  CreateLeadDto,
  LeadListQueryDto,
  UpdateLeadStageDto,
} from '../dto/leads.dto';
import { Lead, LeadActivity } from '../schemas/leads.schema';

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
    const filter: Record<string, unknown> = {};
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

  async findOne(id: string) {
    const lead = await this.leadModel.findById(id).lean().exec();
    if (!lead) throw new NotFoundException('Lead not found');
    const activities = await this.activityModel
      .find({ leadId: id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return { lead, activities };
  }

  async assign(id: string, dto: AssignLeadDto) {
    const lead = await this.leadModel
      .findByIdAndUpdate(
        id,
        { assignedTo: dto.assignedTo, stage: 'assigned' },
        { new: true },
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

  async updateStage(id: string, dto: UpdateLeadStageDto) {
    const lead = await this.leadModel
      .findByIdAndUpdate(id, { stage: dto.stage }, { new: true })
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
