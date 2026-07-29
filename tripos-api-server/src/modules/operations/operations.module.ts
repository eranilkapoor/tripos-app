import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OperationsController } from './controllers/operations.controller';
import { OperationTask, OperationTaskSchema } from './schemas/operation-task.schema';
import { OperationsService } from './services/operations.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: OperationTask.name, schema: OperationTaskSchema }])],
  controllers: [OperationsController],
  providers: [OperationsService],
})
export class OperationsModule {}

