import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import {
  findScopedCrmRecord,
  listCrmRecords,
  updateScopedCrmRecord,
} from '../../../common/utils/crm-list.util';
import {
  CreateItineraryDto,
  UpsertItineraryDayDto,
  UpsertItineraryItemDto,
} from '../dto/itinerary.dto';
import { Itinerary } from '../schemas/itinerary.schema';

@Injectable()
export class ItinerariesService {
  constructor(
    @InjectModel(Itinerary.name) private readonly model: Model<Itinerary>,
  ) {}
  create(dto: CreateItineraryDto) {
    return this.model.create({
      ...dto,
      days: dto.days ?? [],
      images: dto.images ?? [],
    });
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, ['title', 'destination', 'theme']);
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'Itinerary not found');
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Itinerary not found',
    );
  }

  async addDay(id: string, dto: UpsertItineraryDayDto, query: CrmListQueryDto) {
    const itinerary = await this.findOne(id, query);
    const days = ((itinerary as { days?: Array<Record<string, unknown>> })
      .days ?? []) as Array<Record<string, unknown>>;
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { days: [...days, { ...dto, id: dto.id ?? `day-${days.length + 1}` }] },
      'Itinerary not found',
    );
  }

  async updateDay(
    id: string,
    dayId: string,
    dto: UpsertItineraryDayDto,
    query: CrmListQueryDto,
  ) {
    const itinerary = await this.findOne(id, query);
    const days = ((itinerary as { days?: Array<Record<string, unknown>> })
      .days ?? []) as Array<Record<string, unknown>>;
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        days: days.map((day) =>
          String(day.id) === dayId ? { ...day, ...dto, id: dayId } : day,
        ),
      },
      'Itinerary not found',
    );
  }

  async addItem(
    id: string,
    dto: UpsertItineraryItemDto,
    query: CrmListQueryDto,
  ) {
    const itinerary = await this.findOne(id, query);
    const days = ((itinerary as { days?: Array<Record<string, unknown>> })
      .days ?? []) as Array<Record<string, unknown>>;
    const firstDay = days[0] ?? { id: 'day-1', title: 'Day 1', items: [] };
    const items = [
      ...(((firstDay.items as Array<Record<string, unknown>> | undefined) ??
        []) as Array<Record<string, unknown>>),
      dto,
    ];
    const nextDays = days.length
      ? [{ ...firstDay, items }, ...days.slice(1)]
      : [{ ...firstDay, items }];
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { days: nextDays },
      'Itinerary not found',
    );
  }
}
