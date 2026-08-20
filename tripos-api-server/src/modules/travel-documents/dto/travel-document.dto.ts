import { IsObject, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTravelDocumentDto {
  @IsOptional() @IsString() customerId?: string;
  @IsString() @MinLength(2) customerName!: string;
  @IsOptional() @IsString() bookingId?: string;
  @IsString() @MinLength(2) documentType!: string;
  @IsOptional() @IsString() documentNumber?: string;
  @IsOptional() @IsString() expiryDate?: string;
  @IsOptional() @IsString() issuingCountry?: string;
  @IsOptional() @IsString() issueDate?: string;
  @IsOptional() @IsString() fileUrl?: string;
  @IsOptional() @IsString() fileId?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() verifiedBy?: string;
  @IsOptional() @IsObject() compliance?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
