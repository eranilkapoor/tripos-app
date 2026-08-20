import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @MinLength(1)
  invoiceSeries!: string;

  @IsString()
  @MinLength(1)
  invoiceNo!: string;

  @IsString()
  invoiceDate!: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsString()
  countryCode!: string;

  @IsString()
  currencyCode!: string;

  @IsString()
  currencySymbol!: string;

  @IsString()
  taxLabel!: string;

  @IsNumber()
  taxRate!: number;

  @IsObject()
  provider!: Record<string, unknown>;

  @IsObject()
  customer!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsOptional()
  @IsString()
  quotationId?: string;

  @IsOptional() @IsString() agentId?: string;
  @IsOptional() @IsString() supplierId?: string;
  @IsOptional() @IsString() paymentId?: string;

  @IsArray()
  entries!: Array<Record<string, unknown>>;

  @IsOptional()
  @IsObject()
  paymentTerms?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  eInvoice?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  exportDetails?: Record<string, unknown>;

  @IsOptional() @IsObject() approval?: Record<string, unknown>;
  @IsOptional() @IsObject() paymentSummary?: Record<string, unknown>;
  @IsOptional() @IsObject() delivery?: Record<string, unknown>;
  @IsOptional() @IsString() sentAt?: string;
  @IsOptional() @IsString() paidAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  locked?: boolean;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
