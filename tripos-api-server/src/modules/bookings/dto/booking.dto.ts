import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateBookingDto {
  @IsOptional() @IsString() quotationId?: string;
  @IsOptional() @IsString() leadId?: string;
  @IsString() @MinLength(2) customerName!: string;
  @IsString() @MinLength(2) destination!: string;
  @IsOptional() @IsString() travelDates?: string;
  @IsOptional() @IsArray() passengers?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() services?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() documents?: Array<Record<string, unknown>>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
