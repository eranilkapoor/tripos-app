import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateVoucherDto {
  @IsString() @MinLength(2) bookingId!: string;
  @IsOptional() @IsString() customerId?: string;
  @IsString() @MinLength(2) customerName!: string;
  @IsString() @MinLength(2) voucherType!: string;
  @IsOptional() @IsString() voucherNo?: string;
  @IsOptional() @IsString() supplierName?: string;
  @IsOptional() @IsString() supplierId?: string;
  @IsOptional() @IsString() issueDate?: string;
  @IsOptional() @IsString() serviceDate?: string;
  @IsOptional() @IsString() confirmationNumber?: string;
  @IsOptional() @IsArray() lineItems?: Array<Record<string, unknown>>;
  @IsOptional() @IsObject() delivery?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
