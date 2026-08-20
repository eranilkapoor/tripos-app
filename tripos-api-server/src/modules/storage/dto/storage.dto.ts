import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateStoredFileDto {
  @IsString() @MinLength(2) entityType!: string;
  @IsString() @MinLength(1) entityId!: string;
  @IsOptional() @IsString() fileCategory?: string;
  @IsString() @MinLength(2) fileName!: string;
  @IsString() @MinLength(2) mimeType!: string;
  @IsNumber() @Min(0) size!: number;
  @IsOptional() @IsString() checksum?: string;
  @IsOptional() @IsString() uploadedBy?: string;
  @IsOptional() @IsString() visibility?: string;
  @IsOptional() @IsString() expiresAt?: string;
  @IsOptional() @IsObject() retention?: Record<string, unknown>;
  @IsOptional() @IsObject() scanResult?: Record<string, unknown>;
  @IsOptional() @IsObject() accessPolicy?: Record<string, unknown>;
  @IsOptional() @IsObject() provider?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
