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
