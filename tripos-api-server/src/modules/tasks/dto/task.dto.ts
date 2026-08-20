import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() module?: string;
  @IsOptional() @IsString() entityType?: string;
  @IsOptional() @IsString() entityId?: string;
  @IsOptional() @IsString() assignedTo?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsString() departmentId?: string;
  @IsOptional() @IsString() teamId?: string;
  @IsOptional() @IsString() priority?: string;
  @IsOptional() @IsString() dueAt?: string;
  @IsOptional() @IsString() startedAt?: string;
  @IsOptional() @IsString() completedAt?: string;
  @IsOptional() @IsArray() checklist?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() comments?: Array<Record<string, unknown>>;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
