import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuotationsController } from './controllers/quotations.controller';
import { Quotation, QuotationSchema } from './schemas/quotation.schema';
import { QuotationsService } from './services/quotations.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quotation.name, schema: QuotationSchema },
    ]),
  ],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService],
})
export class QuotationsModule {}
