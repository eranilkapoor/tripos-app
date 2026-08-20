import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateOperatingRecordDto {
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsString() moduleKey?: string;
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() entityType?: string;
  @IsOptional() @IsString() entityId?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsString() assignedTo?: string;
  @IsOptional() @IsString() channel?: string;
  @IsOptional() @IsString() priority?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() dueAt?: string;
  @IsOptional() @IsString() scheduledAt?: string;
  @IsOptional() @IsString() completedAt?: string;
  @IsOptional() @IsObject() details?: Record<string, unknown>;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() status?: string;
}
