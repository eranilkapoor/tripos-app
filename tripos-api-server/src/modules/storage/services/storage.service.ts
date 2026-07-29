import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { scopeFilter } from '../../../common/utils/crm-list.util';
import { CreateStoredFileDto } from '../dto/storage.dto';
import { StoredFile } from '../schemas/stored-file.schema';

@Injectable()
export class StorageService {
  constructor(
    @InjectModel(StoredFile.name) private readonly model: Model<StoredFile>,
    private readonly configService: ConfigService,
  ) {}

  createUploadIntent(dto: CreateStoredFileDto) {
    const storageDriver =
      this.configService.get<string>('storage.driver') ?? 'local';
    const storageKey = [
      dto.organizationId ?? 'demo-org',
      dto.entityType,
      dto.entityId,
      `${Date.now()}-${sanitizeFileName(dto.fileName)}`,
    ].join('/');
    const baseUrl = this.configService.get<string>('storage.s3.baseUrl') ?? '';
    return this.model.create({
      ...dto,
      storageDriver,
      storageKey,
      status: storageDriver === 'local' ? 'available' : 'pending_upload',
      url:
        storageDriver === 'local'
          ? `/storage/${storageKey}`
          : `${baseUrl}/${storageKey}`,
      metadata: dto.metadata ?? {},
    });
  }

  list(query: CrmListQueryDto & { entityType?: string; entityId?: string }) {
    const filter = scopeFilter(query);
    if (query.entityType) filter.entityType = query.entityType;
    if (query.entityId) filter.entityId = query.entityId;
    return this.model.find(filter).sort({ updatedAt: -1 }).lean().exec();
  }
}

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
}
