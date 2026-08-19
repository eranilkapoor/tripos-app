import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSettingDto {
  @IsString() @MinLength(2) key!: string;
  @IsString() @MinLength(2) label!: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() value?: unknown;
  @IsOptional() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
