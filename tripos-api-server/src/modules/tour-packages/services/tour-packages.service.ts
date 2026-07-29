import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { listCrmRecords } from '../../../common/utils/crm-list.util';
import { CreateTourPackageDto } from '../dto/tour-package.dto';
import { TourPackage } from '../schemas/tour-package.schema';

@Injectable()
export class TourPackagesService {
  constructor(@InjectModel(TourPackage.name) private readonly model: Model<TourPackage>) {}
  create(dto: CreateTourPackageDto) { return this.model.create({ ...dto, inclusions: dto.inclusions ?? [], exclusions: dto.exclusions ?? [], itinerary: dto.itinerary ?? [] }); }
  list(query: CrmListQueryDto) { return listCrmRecords(this.model, query, ['title', 'destination', 'category']); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Tour package not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('Tour package not found'); return item; }
}
