import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeatureFlagsController } from './controllers/feature-flags.controller';
import { FeatureFlag, FeatureFlagSchema } from './schemas/feature-flag.schema';
import { FeatureFlagsService } from './services/feature-flags.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FeatureFlag.name, schema: FeatureFlagSchema },
    ]),
  ],
  controllers: [FeatureFlagsController],
  providers: [FeatureFlagsService],
})
export class FeatureFlagsModule {}
