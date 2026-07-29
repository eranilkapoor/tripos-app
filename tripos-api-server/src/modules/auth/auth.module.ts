import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantsModule } from '../tenants/tenants.module';
import { AuthController } from './controllers/auth.controller';
import { CrmUser, CrmUserSchema } from './schemas/crm-user.schema';
import { UserSession, UserSessionSchema } from './schemas/user-session.schema';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    TenantsModule,
    MongooseModule.forFeature([
      { name: CrmUser.name, schema: CrmUserSchema },
      { name: UserSession.name, schema: UserSessionSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: SessionAuthGuard }],
  exports: [AuthService],
})
export class AuthModule {}
