import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Quotation,
  QuotationSchema,
} from '../quotations/schemas/quotation.schema';
import { BookingsController } from './controllers/bookings.controller';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { BookingsService } from './services/bookings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Quotation.name, schema: QuotationSchema },
    ]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
