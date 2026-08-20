import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateSavedReportDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) reportType!: string;
  @IsOptional() @IsString() module?: string;
  @IsOptional() @IsString() format?: string;
  @IsOptional() @IsObject() filters?: Record<string, unknown>;
  @IsOptional() @IsObject() schedule?: Record<string, unknown>;
  @IsOptional() @IsArray() recipients?: string[];
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsObject() delivery?: Record<string, unknown>;
  @IsOptional() @IsObject() permissions?: Record<string, unknown>;
  @IsOptional() @IsObject() exportOptions?: Record<string, unknown>;
  @IsOptional() @IsString() lastRunAt?: string;
  @IsOptional() @IsString() nextRunAt?: string;
  @IsOptional() @IsObject() lastRunResult?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}

export class RunSavedReportDto {
  @IsOptional() @IsObject() filters?: Record<string, unknown>;
}

export class RunDueSavedReportsDto {
  @IsOptional() @IsString() now?: string;
  @IsOptional() @IsString() reportType?: string;
}
