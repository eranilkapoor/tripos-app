import {
  IsArray,
  IsEmail,
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

export class RegisterCrmUserDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
  @IsString() @MinLength(2) name!: string;
  @IsString() organizationId!: string;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsArray() branchIds?: string[];
  @IsOptional() @IsArray() departmentIds?: string[];
  @IsOptional() @IsArray() teamIds?: string[];
  @IsOptional() @IsString() role?: string;
}

export class ForgotPasswordDto {
  @IsEmail() email!: string;
}

export class ResetPasswordDto {
  @IsString() token!: string;
  @IsString() @MinLength(6) password!: string;
}

export class InviteCrmUserDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(2) name!: string;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsArray() branchIds?: string[];
  @IsOptional() @IsArray() departmentIds?: string[];
  @IsOptional() @IsArray() teamIds?: string[];
  @IsOptional() @IsString() role?: string;
}

export class AcceptInvitationDto {
  @IsString() token!: string;
  @IsString() @MinLength(6) password!: string;
}

export class UpdateCrmUserPermissionsDto {
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsArray() branchIds?: string[];
  @IsOptional() @IsArray() departmentIds?: string[];
  @IsOptional() @IsArray() teamIds?: string[];
  @IsOptional() @IsArray() permissions?: string[];
}
