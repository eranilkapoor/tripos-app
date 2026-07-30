import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelDocumentsController } from './controllers/travel-documents.controller';
import {
  TravelDocument,
  TravelDocumentSchema,
} from './schemas/travel-document.schema';
import { TravelDocumentsService } from './services/travel-documents.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TravelDocument.name, schema: TravelDocumentSchema },
    ]),
  ],
  controllers: [TravelDocumentsController],
  providers: [TravelDocumentsService],
  exports: [TravelDocumentsService],
})
export class TravelDocumentsModule {}
