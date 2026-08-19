import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from '../notifications/schemas/notification.schema';
import {
  OperationTask,
  OperationTaskSchema,
} from '../operations/schemas/operation-task.schema';
import { BatchJobsController } from './controllers/batch-jobs.controller';
import { BatchJobsService } from './services/batch-jobs.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: OperationTask.name, schema: OperationTaskSchema },
    ]),
  ],
  controllers: [BatchJobsController],
  providers: [BatchJobsService],
})
export class BatchJobsModule {}
