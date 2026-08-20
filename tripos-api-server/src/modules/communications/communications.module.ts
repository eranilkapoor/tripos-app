import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunicationsController } from './controllers/communications.controller';
import {
  Communication,
  CommunicationSchema,
} from './schemas/communication.schema';
import { CommunicationsService } from './services/communications.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Communication.name, schema: CommunicationSchema },
    ]),
  ],
  controllers: [CommunicationsController],
  providers: [CommunicationsService],
})
export class CommunicationsModule {}
