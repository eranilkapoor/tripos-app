import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkflowsController } from './controllers/workflows.controller';
import {
  WorkflowRule,
  WorkflowRuleSchema,
} from './schemas/workflow-rule.schema';
import { WorkflowsService } from './services/workflows.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkflowRule.name, schema: WorkflowRuleSchema },
    ]),
  ],
  controllers: [WorkflowsController],
  providers: [WorkflowsService],
})
export class WorkflowsModule {}
