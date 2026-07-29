import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString, MinLength } from "class-validator";

export class CreateInvoiceDto {
  @IsString()
  @MinLength(1)
  invoiceSeries!: string;

  @IsString()
  @MinLength(1)
  invoiceNo!: string;

  @IsString()
  invoiceDate!: string;

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

  @IsArray()
  entries!: Array<Record<string, unknown>>;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  locked?: boolean;
}

