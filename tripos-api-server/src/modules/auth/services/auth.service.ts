import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from 'node:crypto';
import { Model } from 'mongoose';
import {
  AcceptInvitationDto,
  ForgotPasswordDto,
  InviteCrmUserDto,
  LoginDto,
  RegisterCrmUserDto,
  ResetPasswordDto,
  SwitchWorkspaceDto,
  UpdateCrmUserPermissionsDto,
} from '../dto/auth.dto';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { CrmUser } from '../schemas/crm-user.schema';
import { UserSession } from '../schemas/user-session.schema';
import { OrganizationsService } from '../../organizations/services/organizations.service';
import { IdentityService } from '../../identity/services/identity.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(CrmUser.name) private readonly userModel: Model<CrmUser>,
    @InjectModel(UserSession.name)
    private readonly sessionModel: Model<UserSession>,
    private readonly organizationsService: OrganizationsService,
    private readonly identityService: IdentityService,
  ) {}

  async register(
    dto: RegisterCrmUserDto,
    actor?: { organizationId?: unknown; role?: string },
  ) {
    const organizationId =
      actor?.role === 'platform_admin'
        ? dto.organizationId
        : String(actor?.organizationId ?? '');
    if (!organizationId)
      throw new ForbiddenException('Organization context is required');
    const user = await this.userModel.create({
      ...dto,
      organizationId,
      email: dto.email.toLowerCase(),
      branchId: dto.branchId ?? 'main',
      branchIds: normalizeAccessIds(dto.branchIds, dto.branchId),
      departmentIds: dto.departmentIds ?? [],
      teamIds: dto.teamIds ?? [],
      role: dto.role ?? 'organization_admin',
      passwordHash: hashPassword(dto.password),
    });
    return sanitizeUser(user.toObject());
  }

  async inviteUser(
    dto: InviteCrmUserDto,
    actor?: { organizationId?: unknown; role?: string },
  ) {
    const organizationId =
      actor?.role === 'platform_admin'
        ? String(dto.organizationId ?? '')
        : String(actor?.organizationId ?? '');
    if (!organizationId)
      throw new ForbiddenException('Organization context is required');
    const invitationToken = randomBytes(32).toString('hex');
    const invitationExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const user = await this.userModel
      .findOneAndUpdate(
        { email: dto.email.toLowerCase(), organizationId },
        {
          $set: {
            email: dto.email.toLowerCase(),
            name: dto.name,
            organizationId,
            branchId: dto.branchId ?? 'main',
            branchIds: normalizeAccessIds(dto.branchIds, dto.branchId),
            departmentIds: dto.departmentIds ?? [],
            teamIds: dto.teamIds ?? [],
            role: dto.role ?? 'sales',
            status: 'invited',
            invitationTokenHash: hashToken(invitationToken),
            invitationExpiresAt,
          },
          $setOnInsert: {
            passwordHash: hashPassword(randomBytes(24).toString('hex')),
            permissions: [],
          },
        },
        { new: true, upsert: true },
      )
      .exec();
    await this.identityService.recordInvitation({
      organizationId,
      branchId: dto.branchId ?? 'main',
      email: dto.email,
      name: dto.name,
      role: dto.role ?? 'sales',
      branchIds: normalizeAccessIds(dto.branchIds, dto.branchId),
      tokenHash: hashToken(invitationToken),
      expiresAt: invitationExpiresAt,
      invitedBy: String(actor?.role ?? 'system'),
    });
    return withDevelopmentToken(
      {
        message: 'CRM user invitation created.',
        user: sanitizeUser(user.toObject()),
      },
      'invitationToken',
      invitationToken,
    );
  }

  async login(dto: LoginDto) {
    await this.ensureDemoAdmin();
    const email = dto.email.toLowerCase();
    const organization = dto.organizationCode
      ? await this.organizationsService.findByCode(dto.organizationCode)
      : null;
    if (dto.organizationCode && !organization)
      throw new UnauthorizedException('Invalid email or password');
    const users = await this.userModel
      .find({
        email,
        ...(organization
          ? { organizationId: String((organization as { _id: unknown })._id) }
          : {}),
        status: 'active',
        role: { $ne: 'agent' },
      })
      .lean()
      .exec();
    const platformUsers = users.filter(
      (item) => item.role === 'platform_admin',
    );
    const candidates = platformUsers.length === 1 ? platformUsers : users;
    if (candidates.length !== 1) {
      throw new UnauthorizedException(
        candidates.length
          ? 'Multiple CRM workspaces found for this email. Contact your administrator.'
          : 'Invalid email or password',
      );
    }
    const user = candidates[0];
    if (!user || !verifyPassword(dto.password, user.passwordHash))
      throw new UnauthorizedException('Invalid email or password');
    const selectedOrganization =
      organization ??
      (await this.organizationsService.findOne(String(user.organizationId)));
    const branchId = assertBranchAccess(dto.branchId ?? user.branchId, user);
    const access = await this.identityService.permissionsForUser(
      String(user.organizationId),
      String((user as { _id: unknown })._id),
    );
    const permissions = mergePermissions(user.permissions, access.permissions);
    const token = randomBytes(32).toString('hex');
    await this.sessionModel.create({
      tokenHash: hashToken(token),
      userId: String((user as { _id: unknown })._id),
      organizationId: String((selectedOrganization as { _id: unknown })._id),
      branchId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12),
    });
    return {
      token,
      user: sanitizeUser({
        ...user,
        organizationId: String((selectedOrganization as { _id: unknown })._id),
        branchId,
        branchIds: mergeAccessIds(user.branchIds, access.branchIds, branchId),
        permissions,
      }),
      organization: selectedOrganization,
    };
  }

  async me(token: string) {
    const session = await this.sessionModel
      .findOne({
        tokenHash: hashToken(token),
        revokedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
      })
      .lean()
      .exec();
    if (!session) throw new UnauthorizedException('Session expired');
    const user = await this.userModel.findById(session.userId).lean().exec();
    if (!user) throw new UnauthorizedException('User not found');
    const organization = await this.organizationsService.findOne(
      String(session.organizationId),
    );
    const access = await this.identityService.permissionsForUser(
      String(session.organizationId),
      String((user as { _id: unknown })._id),
    );
    return {
      user: sanitizeUser({
        ...user,
        organizationId: session.organizationId,
        branchId: session.branchId,
        branchIds: mergeAccessIds(
          user.branchIds,
          access.branchIds,
          session.branchId,
        ),
        permissions: mergePermissions(user.permissions, access.permissions),
      }),
      organization,
    };
  }

  async refresh(token: string) {
    const session = await this.sessionModel
      .findOne({
        tokenHash: hashToken(token),
        revokedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
      })
      .lean()
      .exec();
    if (!session) throw new UnauthorizedException('Session expired');
    const user = await this.userModel.findById(session.userId).lean().exec();
    if (!user || user.status !== 'active')
      throw new UnauthorizedException('User not found');
    const organization = await this.organizationsService.findOne(
      String(session.organizationId),
    );
    const nextToken = randomBytes(32).toString('hex');
    await Promise.all([
      this.sessionModel
        .updateOne({ tokenHash: hashToken(token) }, { revokedAt: new Date() })
        .exec(),
      this.sessionModel.create({
        tokenHash: hashToken(nextToken),
        userId: session.userId,
        organizationId: session.organizationId,
        branchId: session.branchId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12),
      }),
    ]);
    const access = await this.identityService.permissionsForUser(
      String(session.organizationId),
      String((user as { _id: unknown })._id),
    );
    return {
      token: nextToken,
      user: sanitizeUser({
        ...user,
        organizationId: session.organizationId,
        branchId: session.branchId,
        branchIds: mergeAccessIds(
          user.branchIds,
          access.branchIds,
          session.branchId,
        ),
        permissions: mergePermissions(user.permissions, access.permissions),
      }),
      organization,
    };
  }

  async switchWorkspace(token: string, dto: SwitchWorkspaceDto) {
    const session = await this.sessionModel
      .findOne({
        tokenHash: hashToken(token),
        revokedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
      })
      .lean()
      .exec();
    if (!session) throw new UnauthorizedException('Session expired');
    const user = await this.userModel.findById(session.userId).lean().exec();
    if (!user || user.status !== 'active')
      throw new UnauthorizedException('User not found');

    let organizationId = String(session.organizationId);
    if (dto.organizationCode) {
      const organization = await this.organizationsService.findByCode(
        dto.organizationCode,
      );
      if (!organization)
        throw new ForbiddenException('Organization access denied');
      const requestedOrganizationId = String(
        (organization as { _id: unknown })._id,
      );
      if (
        requestedOrganizationId !== organizationId &&
        user.role !== 'platform_admin'
      ) {
        throw new ForbiddenException('Organization access denied');
      }
      organizationId = requestedOrganizationId;
    }

    const branchId =
      user.role === 'platform_admin'
        ? (dto.branchId ?? session.branchId)
        : assertBranchAccess(dto.branchId ?? session.branchId, user);

    await this.sessionModel
      .updateOne({ tokenHash: hashToken(token) }, { organizationId, branchId })
      .exec();
    return this.me(token);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const resetToken = randomBytes(32).toString('hex');
    // organizationCode is optional here: without it the lookup can match one
    // of several same-email accounts across organizations, but that is
    // acceptable because the reset token (not the lookup) is what grants
    // account access, and only the matched account's token is issued.
    const organization = dto.organizationCode
      ? await this.organizationsService.findByCode(dto.organizationCode)
      : undefined;
    const user = await this.userModel
      .findOneAndUpdate(
        {
          email: dto.email.toLowerCase(),
          status: { $in: ['active', 'locked'] },
          ...(organization
            ? { organizationId: String((organization as { _id: unknown })._id) }
            : {}),
        },
        {
          resetTokenHash: hashToken(resetToken),
          resetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 30),
        },
        { new: true },
      )
      .exec();
    return withDevelopmentToken(
      { message: 'If the email exists, a password reset link will be sent.' },
      'resetToken',
      user ? resetToken : undefined,
    );
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel
      .findOneAndUpdate(
        {
          resetTokenHash: hashToken(dto.token),
          resetTokenExpiresAt: { $gt: new Date() },
        },
        {
          passwordHash: hashPassword(dto.password),
          status: 'active',
          $unset: { resetTokenHash: '', resetTokenExpiresAt: '' },
        },
        { new: true },
      )
      .exec();
    if (!user)
      throw new UnauthorizedException('Invalid or expired reset token');
    await this.sessionModel
      .updateMany({ userId: String(user._id) }, { revokedAt: new Date() })
      .exec();
    return { success: true };
  }

  async acceptInvitation(dto: AcceptInvitationDto) {
    const user = await this.userModel
      .findOneAndUpdate(
        {
          invitationTokenHash: hashToken(dto.token),
          invitationExpiresAt: { $gt: new Date() },
          status: 'invited',
        },
        {
          passwordHash: hashPassword(dto.password),
          status: 'active',
          $unset: { invitationTokenHash: '', invitationExpiresAt: '' },
        },
        { new: true },
      )
      .exec();
    if (!user)
      throw new UnauthorizedException('Invalid or expired invitation token');
    await this.identityService.markInvitationAccepted(hashToken(dto.token));
    return sanitizeUser(user.toObject());
  }

  async logout(token: string) {
    await this.sessionModel
      .updateOne({ tokenHash: hashToken(token) }, { revokedAt: new Date() })
      .exec();
    return { success: true };
  }

  permissionsCatalog() {
    const modules = [
      'leads',
      'quotations',
      'itineraries',
      'bookings',
      'suppliers',
      'operations',
      'b2b-agents',
      'payments',
      'finance',
      'customers',
      'documents',
      'campaigns',
      'support',
      'audit',
      'reports',
      'settings',
      'tasks',
      'tags',
      'batch-jobs',
    ];
    const actions = ['read', 'create', 'update', 'delete', 'approve', 'export'];
    return {
      modules,
      actions,
      permissions: modules.flatMap((module) =>
        actions.map((action) => `${module}:${action}`),
      ),
      roleDefaults: {
        platform_admin: ['*'],
        organization_admin: ['*'],
        branch_manager: modules.flatMap((module) =>
          ['read', 'create', 'update', 'export'].map(
            (action) => `${module}:${action}`,
          ),
        ),
        sales: [
          'leads:read',
          'leads:create',
          'leads:update',
          'quotations:read',
          'quotations:create',
          'quotations:update',
          'itineraries:read',
          'bookings:read',
          'customers:read',
        ],
        operations: [
          'bookings:read',
          'bookings:update',
          'suppliers:read',
          'operations:read',
          'operations:create',
          'operations:update',
          'documents:read',
          'documents:update',
        ],
        finance: [
          'payments:read',
          'payments:create',
          'payments:update',
          'finance:read',
          'finance:create',
          'finance:update',
          'finance:export',
        ],
        agent: [
          'quotations:read',
          'bookings:read',
          'payments:read',
          'support:read',
          'support:create',
        ],
      },
    };
  }

  async listUsers(query: CrmListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter = userScopeFilter(query);
    if (query.status) filter.status = query.status;
    if (query.search) {
      const search = new RegExp(escapeRegex(query.search), 'i');
      filter.$or = [{ name: search }, { email: search }, { role: search }];
    }
    const [items, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);
    return { items: items.map(sanitizeUser), total, page, limit };
  }

  async findUser(id: string, query: CrmListQueryDto) {
    const user = await this.userModel
      .findOne(userScopeFilter(query, { _id: id }))
      .lean()
      .exec();
    if (!user) throw new ForbiddenException('CRM user not found');
    return sanitizeUser(user);
  }

  async updateUserPermissions(
    id: string,
    dto: UpdateCrmUserPermissionsDto,
    query: CrmListQueryDto,
  ) {
    const update: Record<string, unknown> = {};
    if (dto.role) update.role = dto.role;
    if (dto.status) update.status = dto.status;
    if (dto.branchId) update.branchId = dto.branchId;
    if (dto.branchIds)
      update.branchIds = normalizeAccessIds(dto.branchIds, dto.branchId);
    if (dto.departmentIds) update.departmentIds = dto.departmentIds;
    if (dto.teamIds) update.teamIds = dto.teamIds;
    if (dto.permissions) update.permissions = dto.permissions;
    const user = await this.userModel
      .findOneAndUpdate(userScopeFilter(query, { _id: id }), update, {
        new: true,
      })
      .exec();
    if (!user) throw new ForbiddenException('CRM user not found');
    return sanitizeUser(user.toObject());
  }

  async updateUser(
    id: string,
    dto: UpdateCrmUserPermissionsDto & { name?: string; email?: string },
    query: CrmListQueryDto,
  ) {
    const update: Record<string, unknown> = {};
    if (dto.name) update.name = dto.name;
    if (dto.email) update.email = dto.email.toLowerCase();
    if (dto.role) update.role = dto.role;
    if (dto.status) update.status = dto.status;
    if (dto.branchId) update.branchId = dto.branchId;
    if (dto.branchIds)
      update.branchIds = normalizeAccessIds(dto.branchIds, dto.branchId);
    if (dto.departmentIds) update.departmentIds = dto.departmentIds;
    if (dto.teamIds) update.teamIds = dto.teamIds;
    if (dto.permissions) update.permissions = dto.permissions;
    const user = await this.userModel
      .findOneAndUpdate(userScopeFilter(query, { _id: id }), update, {
        new: true,
      })
      .exec();
    if (!user) throw new ForbiddenException('CRM user not found');
    return sanitizeUser(user.toObject());
  }

  async removeUser(id: string, query: CrmListQueryDto) {
    const user = await this.userModel
      .findOneAndUpdate(
        userScopeFilter(query, { _id: id }),
        { status: 'inactive' },
        { new: true },
      )
      .exec();
    if (!user) throw new ForbiddenException('CRM user not found');
    await this.sessionModel
      .updateMany(
        { userId: id, revokedAt: { $exists: false } },
        { revokedAt: new Date() },
      )
      .exec();
    return sanitizeUser(user.toObject());
  }

  private async ensureDemoAdmin() {
    if (!isDemoBootstrapEnabled()) return;
    const existing = await this.userModel
      .findOne({ email: 'admin@tripos.test' })
      .exec();
    if (existing) return;
    const organization =
      await this.organizationsService.ensureDemoOrganization();
    await this.userModel.create({
      name: 'TripOS Admin',
      email: 'admin@tripos.test',
      passwordHash: hashPassword('TripOS@123'),
      organizationId: String(organization._id),
      branchId: 'delhi',
      branchIds: ['delhi', 'dubai'],
      departmentIds: [],
      teamIds: [],
      role: 'organization_admin',
      permissions: ['*'],
    });
  }
}

function isDemoBootstrapEnabled() {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.TRIPOS_ENABLE_DEMO_ADMIN === 'true'
  );
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  return timingSafeEqual(Buffer.from(hash, 'hex'), candidate);
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function sanitizeUser<T extends { passwordHash?: string }>(user: T) {
  const safeUser = { ...user };
  delete safeUser.passwordHash;
  return safeUser;
}

function assertBranchAccess<
  T extends { branchId?: string; branchIds?: string[] },
>(requestedBranchId: string, user: T) {
  const branchId = requestedBranchId || user.branchId || 'main';
  const branchIds = normalizeAccessIds(user.branchIds, user.branchId);
  if (branchIds.length && !branchIds.includes(branchId)) {
    throw new UnauthorizedException('Branch is not assigned to user');
  }
  return branchId;
}

function normalizeAccessIds(ids?: string[], fallback?: string) {
  return [
    ...new Set(
      [...(ids ?? []), fallback].filter(Boolean).map((id) => String(id)),
    ),
  ];
}

function mergeAccessIds(
  directIds?: string[],
  assignedIds?: string[],
  currentBranchId?: string,
) {
  return normalizeAccessIds(
    [...(directIds ?? []), ...(assignedIds ?? [])],
    currentBranchId,
  );
}

function mergePermissions(
  directPermissions?: string[],
  rolePermissions?: string[],
) {
  if (directPermissions?.includes('*')) return ['*'];
  return [
    ...new Set([...(directPermissions ?? []), ...(rolePermissions ?? [])]),
  ];
}

function userScopeFilter(
  query: CrmListQueryDto,
  extra: Record<string, unknown> = {},
) {
  const filter: Record<string, unknown> = {
    ...extra,
    organizationId: query.organizationId ?? 'demo-org',
  };
  if (query.branchId) filter.branchId = query.branchId;
  return filter;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function withDevelopmentToken<T extends Record<string, unknown>>(
  payload: T,
  key: string,
  token?: string,
) {
  if (process.env.NODE_ENV === 'production' || !token) return payload;
  return { ...payload, [key]: token };
}
