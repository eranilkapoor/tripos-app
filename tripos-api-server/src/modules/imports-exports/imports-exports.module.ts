import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImportsExportsController } from './controllers/imports-exports.controller';
import {
  ImportExportJob,
  ImportExportJobSchema,
} from './schemas/import-export-job.schema';
import { ImportsExportsService } from './services/imports-exports.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImportExportJob.name, schema: ImportExportJobSchema },
    ]),
  ],
  controllers: [ImportsExportsController],
  providers: [ImportsExportsService],
})
export class ImportsExportsModule {}
