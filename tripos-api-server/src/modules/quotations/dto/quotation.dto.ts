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
  @IsString() @MinLength(2) customerName!: string;
  @IsString() @MinLength(2) destination!: string;
  @IsOptional() @IsString() travelDates?: string;
  @IsOptional() @IsNumber() travellers?: number;
  @IsOptional() @IsArray() services?: Array<Record<string, unknown>>;
  @IsOptional() @IsObject() pricing?: Record<string, number>;
  @IsOptional() @IsObject() margins?: Record<string, number>;
  @IsOptional() @IsObject() terms?: Record<string, unknown>;
  @IsOptional() @IsObject() approval?: Record<string, unknown>;
  @IsOptional() @IsString() validUntil?: string;
  @IsOptional() @IsNumber() version?: number;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsObject() customFields?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
