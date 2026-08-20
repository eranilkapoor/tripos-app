import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateImportExportJobDto {
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsString() jobType?: string;
  @IsString() module!: string;
  @IsOptional() @IsString() fileName?: string;
  @IsOptional() @IsString() format?: string;
  @IsOptional() @IsNumber() totalRows?: number;
  @IsOptional() @IsNumber() successRows?: number;
  @IsOptional() @IsNumber() failedRows?: number;
  @IsOptional() @IsString() requestedBy?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
