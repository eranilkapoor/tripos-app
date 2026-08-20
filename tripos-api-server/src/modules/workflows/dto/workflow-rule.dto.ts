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
  @IsOptional() @IsObject() conditions?: Record<string, unknown>;
  @IsOptional() @IsArray() actions?: Array<Record<string, unknown>>;
  @IsOptional() @IsNumber() priority?: number;
  @IsOptional() @IsBoolean() runOnce?: boolean;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
