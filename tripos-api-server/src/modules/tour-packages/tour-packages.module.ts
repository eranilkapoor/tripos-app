import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TourPackagesController } from './controllers/tour-packages.controller';
import { TourPackage, TourPackageSchema } from './schemas/tour-package.schema';
import { TourPackagesService } from './services/tour-packages.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TourPackage.name, schema: TourPackageSchema },
    ]),
  ],
  controllers: [TourPackagesController],
  providers: [TourPackagesService],
  exports: [TourPackagesService],
})
export class TourPackagesModule {}
