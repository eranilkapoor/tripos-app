import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OperatingRecordsController } from './controllers/operating-records.controller';
import {
  OperatingRecord,
  OperatingRecordSchema,
} from './schemas/operating-record.schema';
import { OperatingRecordsService } from './services/operating-records.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OperatingRecord.name, schema: OperatingRecordSchema },
    ]),
  ],
  controllers: [OperatingRecordsController],
  providers: [OperatingRecordsService],
})
export class OperatingRecordsModule {}
