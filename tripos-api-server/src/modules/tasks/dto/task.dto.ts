import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() module?: string;
  @IsOptional() @IsString() entityId?: string;
  @IsOptional() @IsString() assignedTo?: string;
  @IsOptional() @IsString() priority?: string;
  @IsOptional() @IsString() dueAt?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
