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
  @IsString() @MinLength(2) fileName!: string;
  @IsString() @MinLength(2) mimeType!: string;
  @IsNumber() @Min(0) size!: number;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
