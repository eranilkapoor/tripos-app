import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import {
  deleteScopedCrmRecord,
  findScopedCrmRecord,
  listCrmRecords,
  updateScopedCrmRecord,
} from '../../../common/utils/crm-list.util';
import {
  CreateBranchDto,
  CreateDepartmentDto,
  CreatePermissionDto,
  CreateRoleDto,
  CreateRolePermissionDto,
  CreateTeamDto,
  CreateUserRoleDto,
} from '../dto/identity.dto';
import {
  Branch,
  Department,
  Invitation,
  Permission,
  Role,
  RolePermission,
  Team,
  UserRole,
} from '../schemas/identity.schema';

type IdentityModel = Model<any>;

@Injectable()
export class IdentityService {
  constructor(
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
    @InjectModel(Department.name)
    private readonly departmentModel: Model<Department>,
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
    @InjectModel(UserRole.name)
    private readonly userRoleModel: Model<UserRole>,
    @InjectModel(RolePermission.name)
    private readonly rolePermissionModel: Model<RolePermission>,
    @InjectModel(Invitation.name)
    private readonly invitationModel: Model<Invitation>,
  ) {}

  createBranch(dto: CreateBranchDto) {
    return this.branchModel.create(
      normalizeCode(dto as unknown as Record<string, unknown>) as any,
    );
  }

  listBranches(query: CrmListQueryDto) {
    return listCrmRecords(this.branchModel, query, [
      'name',
      'code',
      'city',
      'country',
      'email',
    ]);
  }

  findBranch(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.branchModel, id, query, 'Branch not found');
  }

  updateBranch(
    id: string,
    dto: Partial<CreateBranchDto>,
    query: CrmListQueryDto,
  ) {
    return this.updateScoped(
      this.branchModel,
      id,
      dto,
      query,
      'Branch not found',
    );
  }

  updateBranchStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return this.updateScoped(
      this.branchModel,
      id,
      { status: dto.status },
      query,
      'Branch not found',
    );
  }

  removeBranch(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(
      this.branchModel,
      id,
      query,
      'Branch not found',
    );
  }

  createDepartment(dto: CreateDepartmentDto) {
    return this.departmentModel.create(
      normalizeCode(dto as unknown as Record<string, unknown>) as any,
    );
  }

  listDepartments(query: CrmListQueryDto) {
    return listCrmRecords(this.departmentModel, query, [
      'name',
      'code',
      'branchId',
      'managerUserId',
    ]);
  }

  findDepartment(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(
      this.departmentModel,
      id,
      query,
      'Department not found',
    );
  }

  updateDepartment(
    id: string,
    dto: Partial<CreateDepartmentDto>,
    query: CrmListQueryDto,
  ) {
    return this.updateScoped(
      this.departmentModel,
      id,
      dto,
      query,
      'Department not found',
    );
  }

  removeDepartment(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(
      this.departmentModel,
      id,
      query,
      'Department not found',
    );
  }

  createTeam(dto: CreateTeamDto) {
    return this.teamModel.create(
      normalizeCode(dto as unknown as Record<string, unknown>) as any,
    );
  }

  listTeams(query: CrmListQueryDto) {
    return listCrmRecords(this.teamModel, query, [
      'name',
      'code',
      'branchId',
      'departmentId',
      'leadUserId',
    ]);
  }

  findTeam(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.teamModel, id, query, 'Team not found');
  }

  updateTeam(id: string, dto: Partial<CreateTeamDto>, query: CrmListQueryDto) {
    return this.updateScoped(this.teamModel, id, dto, query, 'Team not found');
  }

  removeTeam(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(this.teamModel, id, query, 'Team not found');
  }

  createRole(dto: CreateRoleDto) {
    return this.roleModel.create(
      normalizeCode(dto as unknown as Record<string, unknown>) as any,
    );
  }

  listRoles(query: CrmListQueryDto) {
    return listCrmRecords(this.roleModel, query, [
      'name',
      'code',
      'description',
      'roleType',
    ]);
  }

  findRole(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.roleModel, id, query, 'Role not found');
  }

  updateRole(id: string, dto: Partial<CreateRoleDto>, query: CrmListQueryDto) {
    return this.updateScoped(this.roleModel, id, dto, query, 'Role not found');
  }

  removeRole(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(this.roleModel, id, query, 'Role not found');
  }

  async createPermission(dto: CreatePermissionDto) {
    return this.permissionModel.create({
      ...dto,
      module: dto.module.toLowerCase(),
      action: dto.action.toLowerCase(),
      code: dto.code.toLowerCase(),
    });
  }

  async listPermissions(query: CrmListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.search) {
      const search = new RegExp(escapeRegex(query.search), 'i');
      filter.$or = [
        { module: search },
        { action: search },
        { code: search },
        { label: search },
      ];
    }
    const [items, total] = await Promise.all([
      this.permissionModel
        .find(filter)
        .sort({ module: 1, action: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.permissionModel.countDocuments(filter).exec(),
    ]);
    return { items, total, page, limit };
  }

  async findPermission(id: string) {
    const permission = await this.permissionModel.findById(id).lean().exec();
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async updatePermission(id: string, dto: Partial<CreatePermissionDto>) {
    const permission = await this.permissionModel
      .findByIdAndUpdate(id, normalizeCode(dto), { new: true })
      .lean()
      .exec();
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async updatePermissionStatus(id: string, dto: StatusUpdateDto) {
    const permission = await this.permissionModel
      .findByIdAndUpdate(id, { status: dto.status }, { new: true })
      .lean()
      .exec();
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async removePermission(id: string) {
    return this.updatePermissionStatus(id, { status: 'inactive' });
  }

  createUserRole(dto: CreateUserRoleDto) {
    return this.userRoleModel.create(dto);
  }

  listUserRoles(query: CrmListQueryDto) {
    return listCrmRecords(this.userRoleModel, query, ['userId', 'roleId']);
  }

  findUserRole(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(
      this.userRoleModel,
      id,
      query,
      'User role assignment not found',
    );
  }

  updateUserRole(
    id: string,
    dto: Partial<CreateUserRoleDto>,
    query: CrmListQueryDto,
  ) {
    return this.updateScoped(
      this.userRoleModel,
      id,
      dto,
      query,
      'User role assignment not found',
    );
  }

  removeUserRole(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(
      this.userRoleModel,
      id,
      query,
      'User role assignment not found',
    );
  }

  createRolePermission(dto: CreateRolePermissionDto) {
    return this.rolePermissionModel.create({
      ...dto,
      permissionCode: dto.permissionCode.toLowerCase(),
    });
  }

  listRolePermissions(query: CrmListQueryDto) {
    return listCrmRecords(this.rolePermissionModel, query, [
      'roleId',
      'permissionCode',
    ]);
  }

  findRolePermission(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(
      this.rolePermissionModel,
      id,
      query,
      'Role permission assignment not found',
    );
  }

  updateRolePermission(
    id: string,
    dto: Partial<CreateRolePermissionDto>,
    query: CrmListQueryDto,
  ) {
    return this.updateScoped(
      this.rolePermissionModel,
      id,
      dto.permissionCode
        ? { ...dto, permissionCode: dto.permissionCode.toLowerCase() }
        : dto,
      query,
      'Role permission assignment not found',
    );
  }

  removeRolePermission(id: string, query: CrmListQueryDto) {
    return deleteScopedCrmRecord(
      this.rolePermissionModel,
      id,
      query,
      'Role permission assignment not found',
    );
  }

  recordInvitation(input: {
    organizationId: string;
    branchId: string;
    email: string;
    name: string;
    role: string;
    branchIds?: string[];
    permissions?: string[];
    tokenHash: string;
    expiresAt: Date;
    invitedBy?: string;
  }) {
    return this.invitationModel
      .findOneAndUpdate(
        {
          organizationId: input.organizationId,
          email: input.email.toLowerCase(),
          status: 'pending',
        },
        {
          $set: {
            ...input,
            email: input.email.toLowerCase(),
            branchIds: input.branchIds ?? [input.branchId],
            permissions: input.permissions ?? [],
            status: 'pending',
          },
        },
        { new: true, upsert: true },
      )
      .lean()
      .exec();
  }

  markInvitationAccepted(tokenHash: string) {
    return this.invitationModel
      .findOneAndUpdate(
        { tokenHash, status: 'pending' },
        { status: 'accepted', acceptedAt: new Date() },
        { new: true },
      )
      .lean()
      .exec();
  }

  listInvitations(query: CrmListQueryDto) {
    return listCrmRecords(this.invitationModel, query, [
      'email',
      'name',
      'role',
      'status',
    ]);
  }

  findInvitation(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(
      this.invitationModel,
      id,
      query,
      'Invitation not found',
    );
  }

  updateInvitation(
    id: string,
    dto: Record<string, unknown>,
    query: CrmListQueryDto,
  ) {
    return this.updateScoped(
      this.invitationModel,
      id,
      dto,
      query,
      'Invitation not found',
    );
  }

  removeInvitation(id: string, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.invitationModel,
      id,
      query,
      { status: 'revoked' },
      'Invitation not found',
    );
  }

  async permissionsForUser(organizationId: string, userId: string) {
    const assignments = await this.userRoleModel
      .find({ organizationId, userId, status: 'active' })
      .lean()
      .exec();
    if (!assignments.length) return { permissions: [], branchIds: [] };
    const roleIds = assignments.map((assignment) => String(assignment.roleId));
    const grants = await this.rolePermissionModel
      .find({
        organizationId,
        roleId: { $in: roleIds },
        status: 'active',
      })
      .lean()
      .exec();
    return {
      permissions: [...new Set(grants.map((grant) => grant.permissionCode))],
      branchIds: [
        ...new Set(
          assignments.flatMap((assignment) => assignment.branchIds ?? []),
        ),
      ],
    };
  }

  private updateScoped(
    model: IdentityModel,
    id: string,
    dto: Record<string, unknown>,
    query: CrmListQueryDto,
    message: string,
  ) {
    return updateScopedCrmRecord(
      model,
      id,
      query,
      sanitizeUpdate(dto),
      message,
    );
  }
}

function normalizeCode<T extends Record<string, unknown>>(dto: T) {
  return {
    ...dto,
    code: typeof dto.code === 'string' ? dto.code.toLowerCase() : dto.code,
  };
}

function sanitizeUpdate(dto: Record<string, unknown>) {
  const blocked = new Set(['_id', 'organizationId', 'createdAt', 'updatedAt']);
  return Object.fromEntries(
    Object.entries(normalizeCode(dto)).filter(
      ([key, value]) => !blocked.has(key) && value !== undefined,
    ),
  );
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
