import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { organizationScopedQuery } from '../../../common/utils/organization-scope.util';
import {
  AcceptInvitationDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  InviteCrmUserDto,
  LoginDto,
  RegisterCrmUserDto,
  ResetPasswordDto,
  SwitchWorkspaceDto,
  UpdateMyProfileDto,
  UpdateCrmUserPermissionsDto,
} from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Public()
  @Post('password/forgot')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.service.forgotPassword(dto);
  }

  @Public()
  @Post('password/reset')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.service.resetPassword(dto);
  }

  @Public()
  @Post('invitations/accept')
  acceptInvitation(@Body() dto: AcceptInvitationDto) {
    return this.service.acceptInvitation(dto);
  }

  @Roles('platform_admin', 'organization_admin')
  @Post('register-crm-user')
  register(
    @Body() dto: RegisterCrmUserDto,
    @Req()
    request: Request & { user?: { organizationId?: unknown; role?: string } },
  ) {
    return this.service.register(dto, request.user);
  }

  @Roles('platform_admin', 'organization_admin')
  @Post('invitations')
  inviteUser(
    @Body() dto: InviteCrmUserDto,
    @Req()
    request: Request & { user?: { organizationId?: unknown; role?: string } },
  ) {
    return this.service.inviteUser(dto, request.user);
  }

  @Get('me') me(@Headers('authorization') authorization?: string) {
    return this.service.me(extractBearer(authorization));
  }

  @Patch('me')
  updateMe(
    @Headers('authorization') authorization: string | undefined,
    @Body() dto: UpdateMyProfileDto,
  ) {
    return this.service.updateMe(extractBearer(authorization), dto);
  }

  @Post('change-password')
  changePassword(
    @Headers('authorization') authorization: string | undefined,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.service.changePassword(extractBearer(authorization), dto);
  }
  @Post('workspace')
  switchWorkspace(
    @Headers('authorization') authorization: string | undefined,
    @Body() dto: SwitchWorkspaceDto,
  ) {
    return this.service.switchWorkspace(extractBearer(authorization), dto);
  }
  @Post('refresh') refresh(@Headers('authorization') authorization?: string) {
    return this.service.refresh(extractBearer(authorization));
  }
  @Post('logout') logout(@Headers('authorization') authorization?: string) {
    return this.service.logout(extractBearer(authorization));
  }

  @Roles('platform_admin', 'organization_admin')
  @Get('permissions/catalog')
  permissionsCatalog() {
    return this.service.permissionsCatalog();
  }

  @Roles('platform_admin', 'organization_admin')
  @Get('users')
  users(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.listUsers(organizationScopedQuery(query, request));
  }

  @Roles('platform_admin', 'organization_admin')
  @Get('users/:id')
  findUser(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findUser(id, organizationScopedQuery(query, request));
  }

  @Roles('platform_admin', 'organization_admin')
  @Patch('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body()
    dto: UpdateCrmUserPermissionsDto & { name?: string; email?: string },
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateUser(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Roles('platform_admin', 'organization_admin')
  @Patch('users/:id/permissions')
  updateUserPermissions(
    @Param('id') id: string,
    @Body() dto: UpdateCrmUserPermissionsDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateUserPermissions(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Roles('platform_admin', 'organization_admin')
  @Delete('users/:id')
  removeUser(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.removeUser(id, organizationScopedQuery(query, request));
  }
}

function extractBearer(authorization?: string) {
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : '';
  if (!token) throw new UnauthorizedException('Missing bearer token');
  return token;
}
