import { IsObject, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSettingDto {
  @IsString() @MinLength(2) key!: string;
  @IsString() @MinLength(2) label!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() scope?: string;
  @IsOptional() @IsString() valueType?: string;
  @IsOptional() value?: unknown;
  @IsOptional() @IsObject() validation?: Record<string, unknown>;
  @IsOptional() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
