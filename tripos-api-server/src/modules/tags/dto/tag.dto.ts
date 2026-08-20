import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTagDto {
  @IsString() @MinLength(2) name!: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() module?: string;
  @IsOptional() @IsString() entityType?: string;
  @IsOptional() @IsNumber() usageCount?: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsObject() rules?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
