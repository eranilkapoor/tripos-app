import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import {
  organizationScopedBody,
  organizationScopedQuery,
} from '../../../common/utils/organization-scope.util';
import {
  CreateBranchDto,
  CreateDepartmentDto,
  CreatePermissionDto,
  CreateRoleDto,
  CreateRolePermissionDto,
  CreateTeamDto,
  CreateUserRoleDto,
} from '../dto/identity.dto';
import { IdentityService } from '../services/identity.service';

@ApiTags('identity')
@Controller('identity')
@Roles('platform_admin', 'organization_admin')
export class IdentityController {
  constructor(private readonly service: IdentityService) {}

  @Post('branches')
  createBranch(@Body() dto: CreateBranchDto, @Req() request: Request) {
    return this.service.createBranch(organizationScopedBody(dto, request));
  }

  @Get('branches')
  listBranches(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.listBranches(organizationScopedQuery(query, request));
  }

  @Get('branches/:id')
  findBranch(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findBranch(id, organizationScopedQuery(query, request));
  }

  @Patch('branches/:id')
  updateBranch(
    @Param('id') id: string,
    @Body() dto: Partial<CreateBranchDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateBranch(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Patch('branches/:id/status')
  updateBranchStatus(
    @Param('id') id: string,
    @Body() dto: StatusUpdateDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateBranchStatus(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Delete('branches/:id')
  removeBranch(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.removeBranch(
      id,
      organizationScopedQuery(query, request),
    );
  }

  @Post('departments')
  createDepartment(@Body() dto: CreateDepartmentDto, @Req() request: Request) {
    return this.service.createDepartment(organizationScopedBody(dto, request));
  }

  @Get('departments')
  listDepartments(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.listDepartments(
      organizationScopedQuery(query, request),
    );
  }

  @Get('departments/:id')
  findDepartment(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findDepartment(
      id,
      organizationScopedQuery(query, request),
    );
  }

  @Patch('departments/:id')
  updateDepartment(
    @Param('id') id: string,
    @Body() dto: Partial<CreateDepartmentDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateDepartment(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Delete('departments/:id')
  removeDepartment(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.removeDepartment(
      id,
      organizationScopedQuery(query, request),
    );
  }

  @Post('teams')
  createTeam(@Body() dto: CreateTeamDto, @Req() request: Request) {
    return this.service.createTeam(organizationScopedBody(dto, request));
  }

  @Get('teams')
  listTeams(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.listTeams(organizationScopedQuery(query, request));
  }

  @Get('teams/:id')
  findTeam(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findTeam(id, organizationScopedQuery(query, request));
  }

  @Patch('teams/:id')
  updateTeam(
    @Param('id') id: string,
    @Body() dto: Partial<CreateTeamDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateTeam(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Delete('teams/:id')
  removeTeam(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.removeTeam(id, organizationScopedQuery(query, request));
  }

  @Post('roles')
  createRole(@Body() dto: CreateRoleDto, @Req() request: Request) {
    return this.service.createRole(organizationScopedBody(dto, request));
  }

  @Get('roles')
  listRoles(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.listRoles(organizationScopedQuery(query, request));
  }

  @Get('roles/:id')
  findRole(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findRole(id, organizationScopedQuery(query, request));
  }

  @Patch('roles/:id')
  updateRole(
    @Param('id') id: string,
    @Body() dto: Partial<CreateRoleDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateRole(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Delete('roles/:id')
  removeRole(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.removeRole(id, organizationScopedQuery(query, request));
  }

  @Post('permissions')
  @Roles('platform_admin')
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.service.createPermission(dto);
  }

  @Get('permissions')
  listPermissions(@Query() query: CrmListQueryDto) {
    return this.service.listPermissions(query);
  }

  @Get('permissions/:id')
  findPermission(@Param('id') id: string) {
    return this.service.findPermission(id);
  }

  @Patch('permissions/:id')
  @Roles('platform_admin')
  updatePermission(
    @Param('id') id: string,
    @Body() dto: Partial<CreatePermissionDto>,
  ) {
    return this.service.updatePermission(id, dto);
  }

  @Patch('permissions/:id/status')
  @Roles('platform_admin')
  updatePermissionStatus(
    @Param('id') id: string,
    @Body() dto: StatusUpdateDto,
  ) {
    return this.service.updatePermissionStatus(id, dto);
  }

  @Delete('permissions/:id')
  @Roles('platform_admin')
  removePermission(@Param('id') id: string) {
    return this.service.removePermission(id);
  }

  @Post('user-roles')
  createUserRole(@Body() dto: CreateUserRoleDto, @Req() request: Request) {
    return this.service.createUserRole(organizationScopedBody(dto, request));
  }

  @Get('user-roles')
  listUserRoles(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.listUserRoles(organizationScopedQuery(query, request));
  }

  @Get('user-roles/:id')
  findUserRole(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findUserRole(
      id,
      organizationScopedQuery(query, request),
    );
  }

  @Patch('user-roles/:id')
  updateUserRole(
    @Param('id') id: string,
    @Body() dto: Partial<CreateUserRoleDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateUserRole(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Delete('user-roles/:id')
  removeUserRole(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.removeUserRole(
      id,
      organizationScopedQuery(query, request),
    );
  }

  @Post('role-permissions')
  createRolePermission(
    @Body() dto: CreateRolePermissionDto,
    @Req() request: Request,
  ) {
    return this.service.createRolePermission(
      organizationScopedBody(dto, request),
    );
  }

  @Get('role-permissions')
  listRolePermissions(
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.listRolePermissions(
      organizationScopedQuery(query, request),
    );
  }

  @Get('role-permissions/:id')
  findRolePermission(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findRolePermission(
      id,
      organizationScopedQuery(query, request),
    );
  }

  @Patch('role-permissions/:id')
  updateRolePermission(
    @Param('id') id: string,
    @Body() dto: Partial<CreateRolePermissionDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateRolePermission(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Delete('role-permissions/:id')
  removeRolePermission(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.removeRolePermission(
      id,
      organizationScopedQuery(query, request),
    );
  }

  @Get('invitations')
  listInvitations(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.listInvitations(
      organizationScopedQuery(query, request),
    );
  }

  @Get('invitations/:id')
  findInvitation(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findInvitation(
      id,
      organizationScopedQuery(query, request),
    );
  }

  @Patch('invitations/:id')
  updateInvitation(
    @Param('id') id: string,
    @Body() dto: Record<string, unknown>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateInvitation(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Delete('invitations/:id')
  removeInvitation(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.removeInvitation(
      id,
      organizationScopedQuery(query, request),
    );
  }
}
