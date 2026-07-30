import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IdentityController } from './controllers/identity.controller';
import {
  Branch,
  BranchSchema,
  Department,
  DepartmentSchema,
  Invitation,
  InvitationSchema,
  Permission,
  PermissionSchema,
  Role,
  RolePermission,
  RolePermissionSchema,
  RoleSchema,
  Team,
  TeamSchema,
  UserRole,
  UserRoleSchema,
} from './schemas/identity.schema';
import { IdentityService } from './services/identity.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Branch.name, schema: BranchSchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: Team.name, schema: TeamSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: UserRole.name, schema: UserRoleSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
      { name: Invitation.name, schema: InvitationSchema },
    ]),
  ],
  controllers: [IdentityController],
  providers: [IdentityService],
  exports: [IdentityService, MongooseModule],
})
export class IdentityModule {}
