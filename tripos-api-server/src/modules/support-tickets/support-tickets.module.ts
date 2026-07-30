import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportTicketsController } from './controllers/support-tickets.controller';
import {
  SupportTicket,
  SupportTicketSchema,
} from './schemas/support-ticket.schema';
import { SupportTicketsService } from './services/support-tickets.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportTicket.name, schema: SupportTicketSchema },
    ]),
  ],
  controllers: [SupportTicketsController],
  providers: [SupportTicketsService],
  exports: [SupportTicketsService],
})
export class SupportTicketsModule {}
