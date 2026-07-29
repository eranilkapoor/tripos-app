import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateNotificationDto {
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsString() message?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() priority?: string;
  @IsOptional() @IsString() audience?: string;
  @IsOptional() @IsString() module?: string;
  @IsOptional() @IsString() recordId?: string;
  @IsOptional() @IsString() assignedTo?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
