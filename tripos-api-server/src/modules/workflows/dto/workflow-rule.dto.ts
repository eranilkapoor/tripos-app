import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateWorkflowRuleDto {
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) code!: string;
  @IsOptional() @IsString() module?: string;
  @IsOptional() @IsString() trigger?: string;
  @IsOptional() @IsString() entityType?: string;
  @IsOptional() @IsObject() conditions?: Record<string, unknown>;
  @IsOptional() @IsArray() actions?: Array<Record<string, unknown>>;
  @IsOptional() @IsObject() schedule?: Record<string, unknown>;
  @IsOptional() @IsObject() throttling?: Record<string, unknown>;
  @IsOptional() @IsNumber() priority?: number;
  @IsOptional() @IsBoolean() runOnce?: boolean;
  @IsOptional() @IsString() lastRunAt?: string;
  @IsOptional() @IsString() nextRunAt?: string;
  @IsOptional() @IsObject() lastRunResult?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
