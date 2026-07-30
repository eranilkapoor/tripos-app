import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItinerariesController } from './controllers/itineraries.controller';
import { Itinerary, ItinerarySchema } from './schemas/itinerary.schema';
import { ItinerariesService } from './services/itineraries.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Itinerary.name, schema: ItinerarySchema },
    ]),
  ],
  controllers: [ItinerariesController],
  providers: [ItinerariesService],
})
export class ItinerariesModule {}
