import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateImportExportJobDto {
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsString() jobType?: string;
  @IsString() module!: string;
  @IsOptional() @IsString() fileName?: string;
  @IsOptional() @IsString() fileId?: string;
  @IsOptional() @IsString() format?: string;
  @IsOptional() @IsObject() mapping?: Record<string, unknown>;
  @IsOptional() @IsObject() filters?: Record<string, unknown>;
  @IsOptional() @IsNumber() totalRows?: number;
  @IsOptional() @IsNumber() successRows?: number;
  @IsOptional() @IsNumber() failedRows?: number;
  @IsOptional() @IsString() requestedBy?: string;
  @IsOptional() @IsString() approvedBy?: string;
  @IsOptional() @IsArray() errorRows?: Array<Record<string, unknown>>;
  @IsOptional() @IsObject() result?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
