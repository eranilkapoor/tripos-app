import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTravelDocumentDto {
  @IsString() @MinLength(2) customerName!: string;
  @IsOptional() @IsString() bookingId?: string;
  @IsString() @MinLength(2) documentType!: string;
  @IsOptional() @IsString() documentNumber?: string;
  @IsOptional() @IsString() expiryDate?: string;
  @IsOptional() @IsString() fileUrl?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
