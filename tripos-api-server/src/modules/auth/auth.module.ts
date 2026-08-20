import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationsModule } from '../organizations/organizations.module';
import { IdentityModule } from '../identity/identity.module';
import { AuthController } from './controllers/auth.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UserSession, UserSessionSchema } from './schemas/user-session.schema';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    OrganizationsModule,
    IdentityModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserSession.name, schema: UserSessionSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: SessionAuthGuard },
    { provide: APP_GUARD, useClass: RbacGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
