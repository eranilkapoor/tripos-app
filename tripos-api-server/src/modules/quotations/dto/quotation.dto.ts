import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateQuotationDto {
  @IsOptional() @IsString() leadId?: string;
  @IsOptional() @IsString() customerId?: string;
  @IsOptional() @IsString() quoteNo?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsString() agentId?: string;
  @IsOptional() @IsString() campaignId?: string;
  @IsOptional() @IsString() currencyCode?: string;
  @IsString() @MinLength(2) customerName!: string;
  @IsString() @MinLength(2) destination!: string;
  @IsOptional() @IsString() travelDates?: string;
  @IsOptional() @IsNumber() travellers?: number;
  @IsOptional() @IsArray() services?: Array<Record<string, unknown>>;
  @IsOptional() @IsObject() pricing?: Record<string, number>;
  @IsOptional() @IsObject() margins?: Record<string, number>;
  @IsOptional() @IsObject() terms?: Record<string, unknown>;
  @IsOptional() @IsObject() approval?: Record<string, unknown>;
  @IsOptional() @IsObject() document?: Record<string, unknown>;
  @IsOptional() @IsObject() supplierCosting?: Record<string, unknown>;
  @IsOptional() @IsObject() commission?: Record<string, unknown>;
  @IsOptional() @IsArray() revisions?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() communications?: Array<Record<string, unknown>>;
  @IsOptional() @IsString() validUntil?: string;
  @IsOptional() @IsString() sentAt?: string;
  @IsOptional() @IsString() acceptedAt?: string;
  @IsOptional() @IsString() rejectedAt?: string;
  @IsOptional() @IsNumber() version?: number;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsObject() customFields?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
