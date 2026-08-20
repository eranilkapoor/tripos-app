import { IsObject, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateNotificationDto {
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsString() message?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() priority?: string;
  @IsOptional() @IsString() audience?: string;
  @IsOptional() @IsString() module?: string;
  @IsOptional() @IsString() recordId?: string;
  @IsOptional() @IsString() entityType?: string;
  @IsOptional() @IsString() entityId?: string;
  @IsOptional() @IsString() assignedTo?: string;
  @IsOptional() @IsString() userId?: string;
  @IsOptional() @IsString() agentId?: string;
  @IsOptional() @IsString() customerId?: string;
  @IsOptional() @IsString() actionUrl?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsObject() delivery?: Record<string, unknown>;
  @IsOptional() @IsString() scheduledAt?: string;
  @IsOptional() @IsString() readAt?: string;
  @IsOptional() @IsString() archivedAt?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
