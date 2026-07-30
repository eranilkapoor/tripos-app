import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COLLECTION_NAMES } from '../../../common/constants/collection-names.constants';

export type BranchDocument = HydratedDocument<Branch>;
export type DepartmentDocument = HydratedDocument<Department>;
export type TeamDocument = HydratedDocument<Team>;
export type RoleDocument = HydratedDocument<Role>;
export type PermissionDocument = HydratedDocument<Permission>;
export type UserRoleDocument = HydratedDocument<UserRole>;
export type RolePermissionDocument = HydratedDocument<RolePermission>;
export type InvitationDocument = HydratedDocument<Invitation>;

@Schema({ collection: COLLECTION_NAMES.BRANCH, timestamps: true })
export class Branch {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, trim: true, index: true }) code!: string;
  @Prop({ trim: true }) city?: string;
  @Prop({ trim: true }) country?: string;
  @Prop({ trim: true }) timezone?: string;
  @Prop({ trim: true }) address?: string;
  @Prop({ trim: true }) phone?: string;
  @Prop({ trim: true, lowercase: true }) email?: string;
  @Prop({ type: Object, default: {} }) settings!: Record<string, unknown>;
  @Prop({ enum: ['active', 'inactive'], default: 'active', index: true })
  status!: string;
}

@Schema({ collection: COLLECTION_NAMES.DEPARTMENT, timestamps: true })
export class Department {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ required: true, index: true }) branchId!: string;
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, trim: true, index: true }) code!: string;
  @Prop({ trim: true }) managerUserId?: string;
  @Prop({ type: Object, default: {} }) settings!: Record<string, unknown>;
  @Prop({ enum: ['active', 'inactive'], default: 'active', index: true })
  status!: string;
}

@Schema({ collection: COLLECTION_NAMES.TEAM, timestamps: true })
export class Team {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ required: true, index: true }) branchId!: string;
  @Prop({ required: true, index: true }) departmentId!: string;
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, trim: true, index: true }) code!: string;
  @Prop({ trim: true }) leadUserId?: string;
  @Prop({ type: [String], default: [] }) memberUserIds!: string[];
  @Prop({ type: Object, default: {} }) settings!: Record<string, unknown>;
  @Prop({ enum: ['active', 'inactive'], default: 'active', index: true })
  status!: string;
}

@Schema({ collection: COLLECTION_NAMES.ROLE, timestamps: true })
export class Role {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, trim: true, index: true }) code!: string;
  @Prop({ trim: true }) description?: string;
  @Prop({ type: [String], default: [] }) defaultBranchIds!: string[];
  @Prop({ enum: ['system', 'custom'], default: 'custom', index: true })
  roleType!: string;
  @Prop({ enum: ['active', 'inactive'], default: 'active', index: true })
  status!: string;
}

@Schema({ collection: COLLECTION_NAMES.PERMISSION, timestamps: true })
export class Permission {
  @Prop({ required: true, trim: true, index: true }) module!: string;
  @Prop({ required: true, trim: true, index: true }) action!: string;
  @Prop({ required: true, trim: true, unique: true, index: true })
  code!: string;
  @Prop({ required: true, trim: true }) label!: string;
  @Prop({ trim: true }) description?: string;
  @Prop({ enum: ['active', 'inactive'], default: 'active', index: true })
  status!: string;
}

@Schema({ collection: COLLECTION_NAMES.USER_ROLE, timestamps: true })
export class UserRole {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ required: true, index: true }) userId!: string;
  @Prop({ required: true, index: true }) roleId!: string;
  @Prop({ type: [String], default: [] }) branchIds!: string[];
  @Prop({ type: [String], default: [] }) departmentIds!: string[];
  @Prop({ type: [String], default: [] }) teamIds!: string[];
  @Prop({ enum: ['active', 'inactive'], default: 'active', index: true })
  status!: string;
}

@Schema({ collection: COLLECTION_NAMES.ROLE_PERMISSION, timestamps: true })
export class RolePermission {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ required: true, index: true }) roleId!: string;
  @Prop({ required: true, index: true }) permissionCode!: string;
  @Prop({ type: Object, default: {} }) conditions!: Record<string, unknown>;
  @Prop({ enum: ['active', 'inactive'], default: 'active', index: true })
  status!: string;
}

@Schema({ collection: COLLECTION_NAMES.INVITATION, timestamps: true })
export class Invitation {
  @Prop({ required: true, index: true }) organizationId!: string;
  @Prop({ default: 'main', index: true }) branchId!: string;
  @Prop({ required: true, trim: true, lowercase: true, index: true })
  email!: string;
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, trim: true, index: true }) role!: string;
  @Prop({ type: [String], default: [] }) branchIds!: string[];
  @Prop({ type: [String], default: [] }) permissions!: string[];
  @Prop({ index: true }) tokenHash?: string;
  @Prop() expiresAt?: Date;
  @Prop({
    enum: ['pending', 'accepted', 'expired', 'revoked'],
    default: 'pending',
    index: true,
  })
  status!: string;
  @Prop({ trim: true }) invitedBy?: string;
  @Prop() acceptedAt?: Date;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
export const DepartmentSchema = SchemaFactory.createForClass(Department);
export const TeamSchema = SchemaFactory.createForClass(Team);
export const RoleSchema = SchemaFactory.createForClass(Role);
export const PermissionSchema = SchemaFactory.createForClass(Permission);
export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
export const RolePermissionSchema =
  SchemaFactory.createForClass(RolePermission);
export const InvitationSchema = SchemaFactory.createForClass(Invitation);

BranchSchema.index({ organizationId: 1, code: 1 }, { unique: true });
DepartmentSchema.index(
  { organizationId: 1, branchId: 1, code: 1 },
  { unique: true },
);
TeamSchema.index(
  { organizationId: 1, branchId: 1, departmentId: 1, code: 1 },
  { unique: true },
);
RoleSchema.index({ organizationId: 1, code: 1 }, { unique: true });
UserRoleSchema.index(
  { organizationId: 1, userId: 1, roleId: 1 },
  { unique: true },
);
RolePermissionSchema.index(
  { organizationId: 1, roleId: 1, permissionCode: 1 },
  { unique: true },
);
