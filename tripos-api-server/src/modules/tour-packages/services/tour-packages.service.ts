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
import { CreateTourPackageDto } from '../dto/tour-package.dto';
import { TourPackage } from '../schemas/tour-package.schema';

@Injectable()
export class TourPackagesService {
  constructor(
    @InjectModel(TourPackage.name) private readonly model: Model<TourPackage>,
  ) {}
  create(dto: CreateTourPackageDto) {
    return this.model.create({
      ...dto,
      inclusions: dto.inclusions ?? [],
      exclusions: dto.exclusions ?? [],
      itinerary: dto.itinerary ?? [],
    });
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, [
      'title',
      'destination',
      'category',
    ]);
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'Tour package not found');
  }
  update(
    id: string,
    dto: Partial<CreateTourPackageDto>,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      dto,
      'Tour package not found',
    );
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'Tour package not found',
    );
  }
  remove(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(
      this.model,
      id,
      query,
      'Tour package not found',
    );
  }
}
