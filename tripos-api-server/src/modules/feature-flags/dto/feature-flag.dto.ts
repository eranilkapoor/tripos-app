import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateFeatureFlagDto {
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
  @IsString() @MinLength(2) key!: string;
  @IsString() @MinLength(2) label!: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsBoolean() enabled?: boolean;
  @IsOptional() @IsObject() rollout?: Record<string, unknown>;
  @IsOptional() @IsObject() rules?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
