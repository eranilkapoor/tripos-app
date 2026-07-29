import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSupportTicketDto {
  @IsString() @MinLength(2) subject!: string;
  @IsString() @MinLength(2) customerName!: string;
  @IsOptional() @IsString() bookingId?: string;
  @IsOptional() @IsString() channel?: string;
  @IsOptional() @IsString() priority?: string;
  @IsOptional() @IsString() assignedTo?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
