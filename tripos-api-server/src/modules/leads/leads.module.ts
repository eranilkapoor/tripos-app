import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadsController } from './controllers/leads.controller';
import { PublicLeadsController } from './controllers/public-leads.controller';
import {
  Lead,
  LeadActivity,
  LeadActivitySchema,
  LeadSchema,
} from './schemas/leads.schema';
import { LeadsService } from './services/leads.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lead.name, schema: LeadSchema },
      { name: LeadActivity.name, schema: LeadActivitySchema },
    ]),
  ],
  controllers: [LeadsController, PublicLeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
