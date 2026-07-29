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
import { LoginDto, RegisterCrmUserDto } from '../dto/auth.dto';
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

  async logout(token: string) {
    await this.sessionModel
      .updateOne({ tokenHash: hashToken(token) }, { revokedAt: new Date() })
      .exec();
    return { success: true };
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
