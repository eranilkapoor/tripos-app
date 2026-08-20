import {
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
  @IsOptional() @IsString() organizationCode?: string;
  @IsOptional() @IsString() branchId?: string;
}

export class SwitchWorkspaceDto {
  @IsOptional() @IsString() organizationCode?: string;
  @IsOptional() @IsString() branchId?: string;
}

export class RegisterUserDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
  @IsString() @MinLength(2) name!: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() timezone?: string;
  @IsOptional() @IsString() locale?: string;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsArray() branchIds?: string[];
  @IsOptional() @IsArray() departmentIds?: string[];
  @IsOptional() @IsArray() teamIds?: string[];
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() employeeCode?: string;
  @IsOptional() @IsString() managerUserId?: string;
  @IsOptional() @IsObject() profile?: Record<string, unknown>;
  @IsOptional() @IsObject() preferences?: Record<string, unknown>;
  @IsOptional() @IsObject() notificationPreferences?: Record<string, unknown>;
}

export class ForgotPasswordDto {
  @IsEmail() email!: string;
  @IsOptional() @IsString() organizationCode?: string;
}

export class ResetPasswordDto {
  @IsString() token!: string;
  @IsString() @MinLength(6) password!: string;
}

export class ChangePasswordDto {
  @IsString() currentPassword!: string;
  @IsString() @MinLength(6) newPassword!: string;
}

export class UpdateMyProfileDto {
  @IsOptional() @IsString() @MinLength(2) name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() timezone?: string;
  @IsOptional() @IsString() locale?: string;
  @IsOptional() @IsObject() profile?: Record<string, unknown>;
  @IsOptional() @IsObject() notificationPreferences?: Record<string, unknown>;
}

export class InviteUserDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(2) name!: string;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsArray() branchIds?: string[];
  @IsOptional() @IsArray() departmentIds?: string[];
  @IsOptional() @IsArray() teamIds?: string[];
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() timezone?: string;
  @IsOptional() @IsString() locale?: string;
  @IsOptional() @IsString() employeeCode?: string;
  @IsOptional() @IsString() managerUserId?: string;
  @IsOptional() @IsObject() profile?: Record<string, unknown>;
  @IsOptional() @IsObject() preferences?: Record<string, unknown>;
  @IsOptional() @IsObject() notificationPreferences?: Record<string, unknown>;
}

export class AcceptInvitationDto {
  @IsString() token!: string;
  @IsString() @MinLength(6) password!: string;
}

export class UpdateUserPermissionsDto {
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsArray() branchIds?: string[];
  @IsOptional() @IsArray() departmentIds?: string[];
  @IsOptional() @IsArray() teamIds?: string[];
  @IsOptional() @IsArray() permissions?: string[];
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() timezone?: string;
  @IsOptional() @IsString() locale?: string;
  @IsOptional() @IsString() employeeCode?: string;
  @IsOptional() @IsString() managerUserId?: string;
  @IsOptional() @IsObject() profile?: Record<string, unknown>;
  @IsOptional() @IsObject() preferences?: Record<string, unknown>;
  @IsOptional() @IsObject() notificationPreferences?: Record<string, unknown>;
}
