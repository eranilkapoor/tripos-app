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
  @IsOptional() @IsString() channel?: string;
  @IsOptional() @IsString() priority?: string;
  @IsOptional() @IsString() assignedTo?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() messages?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsObject() satisfaction?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
