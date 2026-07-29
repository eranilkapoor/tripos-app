import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageController } from './controllers/storage.controller';
import { StoredFile, StoredFileSchema } from './schemas/stored-file.schema';
import { StorageService } from './services/storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StoredFile.name, schema: StoredFileSchema },
    ]),
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
