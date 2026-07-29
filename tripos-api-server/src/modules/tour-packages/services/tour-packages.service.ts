import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import { CreateTourPackageDto } from '../dto/tour-package.dto';
import { TourPackage } from '../schemas/tour-package.schema';

@Injectable()
export class TourPackagesService {
  constructor(@InjectModel(TourPackage.name) private readonly model: Model<TourPackage>) {}
  create(dto: CreateTourPackageDto) { return this.model.create({ ...dto, inclusions: dto.inclusions ?? [], exclusions: dto.exclusions ?? [], itinerary: dto.itinerary ?? [] }); }
  list() { return this.model.find().sort({ updatedAt: -1 }).lean().exec(); }
  async findOne(id: string) { const item = await this.model.findById(id).lean().exec(); if (!item) throw new NotFoundException('Tour package not found'); return item; }
  async updateStatus(id: string, dto: StatusUpdateDto) { const item = await this.model.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec(); if (!item) throw new NotFoundException('Tour package not found'); return item; }
}
