import {
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateBranchDto {
  @IsOptional() @IsString() organizationId?: string;
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) code!: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() timezone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() managerUserId?: string;
  @IsOptional() @IsString() branchType?: string;
  @IsOptional() @IsString() taxRegistrationNo?: string;
  @IsOptional() @IsString() costCenterCode?: string;
  @IsOptional() @IsString() language?: string;
  @IsOptional() @IsObject() geo?: Record<string, unknown>;
  @IsOptional() @IsObject() contactPerson?: Record<string, unknown>;
  @IsOptional() @IsObject() operatingHours?: Record<string, unknown>;
  @IsOptional() @IsObject() taxProfile?: Record<string, unknown>;
  @IsOptional() @IsObject() settings?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateDepartmentDto {
  @IsOptional() @IsString() organizationId?: string;
  @IsString() branchId!: string;
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) code!: string;
  @IsOptional() @IsString() managerUserId?: string;
  @IsOptional() @IsString() departmentType?: string;
  @IsOptional() @IsString() costCenterCode?: string;
  @IsOptional() @IsString() escalationUserId?: string;
  @IsOptional() @IsArray() serviceModules?: string[];
  @IsOptional() @IsObject() slaPolicy?: Record<string, unknown>;
  @IsOptional() @IsObject() settings?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateTeamDto {
  @IsOptional() @IsString() organizationId?: string;
  @IsString() branchId!: string;
  @IsString() departmentId!: string;
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) code!: string;
  @IsOptional() @IsString() leadUserId?: string;
  @IsOptional() @IsArray() memberUserIds?: string[];
  @IsOptional() @IsArray() skillTags?: string[];
  @IsOptional() @IsArray() supportedDestinations?: string[];
  @IsOptional() @IsObject() capacity?: Record<string, unknown>;
  @IsOptional() @IsObject() escalationPolicy?: Record<string, unknown>;
  @IsOptional() @IsObject() queueRules?: Record<string, unknown>;
  @IsOptional() @IsObject() settings?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRoleDto {
  @IsOptional() @IsString() organizationId?: string;
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) code!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() defaultBranchIds?: string[];
  @IsOptional() @IsArray() defaultDepartmentIds?: string[];
  @IsOptional() @IsArray() defaultTeamIds?: string[];
  @IsOptional() @IsObject() limits?: Record<string, unknown>;
  @IsOptional() @IsString() roleType?: string;
}

export class CreatePermissionDto {
  @IsString() module!: string;
  @IsString() action!: string;
  @IsString() code!: string;
  @IsString() label!: string;
  @IsOptional() @IsString() description?: string;
}

export class CreateUserRoleDto {
  @IsOptional() @IsString() organizationId?: string;
  @IsString() userId!: string;
  @IsString() roleId!: string;
  @IsOptional() @IsArray() branchIds?: string[];
  @IsOptional() @IsArray() departmentIds?: string[];
  @IsOptional() @IsArray() teamIds?: string[];
}

export class CreateRolePermissionDto {
  @IsOptional() @IsString() organizationId?: string;
  @IsString() roleId!: string;
  @IsString() permissionCode!: string;
  @IsOptional() @IsObject() conditions?: Record<string, unknown>;
  @IsOptional() @IsString() scope?: string;
}
