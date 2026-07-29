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
  UpdateCrmUserPermissionsDto,
} from '../dto/auth.dto';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { CrmUser } from '../schemas/crm-user.schema';
import { UserSession } from '../schemas/user-session.schema';
import { TenantsService } from '../../tenants/services/tenants.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(CrmUser.name) private readonly userModel: Model<CrmUser>,
    @InjectModel(UserSession.name)
    private readonly sessionModel: Model<UserSession>,
    private readonly tenantsService: TenantsService,
  ) {}

  async register(
    dto: RegisterCrmUserDto,
    actor?: { tenantId?: unknown; role?: string },
  ) {
    const tenantId =
      actor?.role === 'platform_admin'
        ? dto.tenantId
        : String(actor?.tenantId ?? '');
    if (!tenantId) throw new ForbiddenException('Tenant context is required');
    const user = await this.userModel.create({
      ...dto,
      tenantId,
      email: dto.email.toLowerCase(),
      branchId: dto.branchId ?? 'main',
      role: dto.role ?? 'tenant_admin',
      passwordHash: hashPassword(dto.password),
    });
    return sanitizeUser(user.toObject());
  }

  async inviteUser(
    dto: InviteCrmUserDto,
    actor?: { tenantId?: unknown; role?: string },
  ) {
    const tenantId =
      actor?.role === 'platform_admin'
        ? String(dto.tenantId ?? '')
        : String(actor?.tenantId ?? '');
    if (!tenantId) throw new ForbiddenException('Tenant context is required');
    const invitationToken = randomBytes(32).toString('hex');
    const user = await this.userModel
      .findOneAndUpdate(
        { email: dto.email.toLowerCase() },
        {
          $set: {
            email: dto.email.toLowerCase(),
            name: dto.name,
            tenantId,
            branchId: dto.branchId ?? 'main',
            role: dto.role ?? 'sales',
            status: 'invited',
            invitationTokenHash: hashToken(invitationToken),
            invitationExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          },
          $setOnInsert: {
            passwordHash: hashPassword(randomBytes(24).toString('hex')),
            permissions: [],
          },
        },
        { new: true, upsert: true },
      )
      .exec();
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
    const user = await this.userModel
      .findOne({ email: dto.email.toLowerCase(), status: 'active' })
      .lean()
      .exec();
    if (!user || !verifyPassword(dto.password, user.passwordHash))
      throw new UnauthorizedException('Invalid email or password');
    const tenant = await this.tenantsService.findOne(String(user.tenantId));
    if (
      dto.tenantCode &&
      String((tenant as { code?: string }).code).toUpperCase() !==
        dto.tenantCode.toUpperCase()
    )
      throw new UnauthorizedException('Tenant does not match user');
    const branchId = dto.branchId ?? user.branchId;
    const token = randomBytes(32).toString('hex');
    await this.sessionModel.create({
      tokenHash: hashToken(token),
      userId: String((user as { _id: unknown })._id),
      tenantId: user.tenantId,
      branchId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12),
    });
    return { token, user: sanitizeUser({ ...user, branchId }), tenant };
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
    const tenant = await this.tenantsService.findOne(String(session.tenantId));
    return {
      user: sanitizeUser({ ...user, branchId: session.branchId }),
      tenant,
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
    const tenant = await this.tenantsService.findOne(String(session.tenantId));
    const nextToken = randomBytes(32).toString('hex');
    await Promise.all([
      this.sessionModel
        .updateOne({ tokenHash: hashToken(token) }, { revokedAt: new Date() })
        .exec(),
      this.sessionModel.create({
        tokenHash: hashToken(nextToken),
        userId: session.userId,
        tenantId: session.tenantId,
        branchId: session.branchId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12),
      }),
    ]);
    return {
      token: nextToken,
      user: sanitizeUser({ ...user, branchId: session.branchId }),
      tenant,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const resetToken = randomBytes(32).toString('hex');
    const user = await this.userModel
      .findOneAndUpdate(
        {
          email: dto.email.toLowerCase(),
          status: { $in: ['active', 'locked'] },
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
      'settings',
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
        tenant_admin: ['*'],
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
    const existing = await this.userModel
      .findOne({ email: 'admin@tripos.test' })
      .exec();
    if (existing) return;
    const tenant = await this.tenantsService.ensureDemoTenant();
    await this.userModel.create({
      name: 'TripOS Admin',
      email: 'admin@tripos.test',
      passwordHash: hashPassword('TripOS@123'),
      tenantId: String(tenant._id),
      branchId: 'delhi',
      role: 'tenant_admin',
      permissions: ['*'],
    });
  }
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

function userScopeFilter(
  query: CrmListQueryDto,
  extra: Record<string, unknown> = {},
) {
  const filter: Record<string, unknown> = {
    ...extra,
    tenantId: query.organizationId ?? 'demo-org',
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
