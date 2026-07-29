import {
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateOperationTaskDto {
  @IsOptional() @IsString() bookingId?: string;
  @IsString() @MinLength(2) title!: string;
  @IsString() @MinLength(2) serviceType!: string;
  @IsOptional() @IsString() supplierId?: string;
  @IsOptional() @IsString() assignedTo?: string;
  @IsOptional() @IsDateString() dueAt?: string;
  @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}

export class AssignOperationTaskDto {
  @IsString() @MinLength(2) assignedTo!: string;
  @IsOptional() @IsString() note?: string;
}

export class UpdateOperationSlaDto {
  @IsOptional() @IsDateString() dueAt?: string;
  @IsOptional() @IsString() priority?: string;
  @IsOptional() @IsString() slaStatus?: string;
}

export class EscalateOperationTaskDto {
  @IsString() @MinLength(2) reason!: string;
  @IsOptional() @IsString() escalatedTo?: string;
  @IsOptional() @IsString() severity?: string;
}

export class AddOperationTimelineEventDto {
  @IsString() @MinLength(2) type!: string;
  @IsString() @MinLength(2) note!: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
