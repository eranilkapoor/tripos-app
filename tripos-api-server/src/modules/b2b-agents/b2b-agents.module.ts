import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { B2BAgentsController } from './controllers/b2b-agents.controller';
import { B2BAgent, B2BAgentSchema } from './schemas/b2b-agent.schema';
import { B2BAgentsService } from './services/b2b-agents.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: B2BAgent.name, schema: B2BAgentSchema }])],
  controllers: [B2BAgentsController],
  providers: [B2BAgentsService],
})
export class B2BAgentsModule {}

