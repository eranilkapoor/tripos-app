import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationsController } from './controllers/organizations.controller';
import { TenantsController } from './controllers/tenants.controller';
import { Tenant, TenantSchema } from './schemas/tenant.schema';
import { TenantsService } from './services/tenants.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
  ],
  controllers: [TenantsController, OrganizationsController],
  providers: [TenantsService],
  exports: [TenantsService, MongooseModule],
})
export class TenantsModule {}
