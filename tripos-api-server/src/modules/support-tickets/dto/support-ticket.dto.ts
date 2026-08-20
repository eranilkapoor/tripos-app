import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateSupportTicketDto {
  @IsString() @MinLength(2) subject!: string;
  @IsOptional() @IsString() ticketNo?: string;
  @IsOptional() @IsString() customerId?: string;
  @IsString() @MinLength(2) customerName!: string;
  @IsOptional() @IsString() bookingId?: string;
  @IsOptional() @IsString() agentId?: string;
  @IsOptional() @IsString() supplierId?: string;
  @IsOptional() @IsString() channel?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsString() priority?: string;
  @IsOptional() @IsString() assignedTo?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() subCategory?: string;
  @IsOptional() @IsString() departmentId?: string;
  @IsOptional() @IsString() teamId?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() firstResponseDueAt?: string;
  @IsOptional() @IsString() firstRespondedAt?: string;
  @IsOptional() @IsString() resolutionDueAt?: string;
  @IsOptional() @IsString() resolvedAt?: string;
  @IsOptional() @IsString() closedAt?: string;
  @IsOptional() @IsString() resolutionSummary?: string;
  @IsOptional() @IsString() rootCause?: string;
  @IsOptional() @IsObject() sla?: Record<string, unknown>;
  @IsOptional() @IsArray() escalations?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() messages?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsObject() satisfaction?: Record<string, unknown>;
  @IsOptional() @IsObject() attachments?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
