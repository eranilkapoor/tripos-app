import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTagDto {
  @IsString() @MinLength(2) name!: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() module?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
