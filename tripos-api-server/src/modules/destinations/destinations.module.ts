import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DestinationsController } from './controllers/destinations.controller';
import { Destination, DestinationSchema } from './schemas/destination.schema';
import { DestinationsService } from './services/destinations.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Destination.name, schema: DestinationSchema },
    ]),
  ],
  controllers: [DestinationsController],
  providers: [DestinationsService],
  exports: [DestinationsService],
})
export class DestinationsModule {}
