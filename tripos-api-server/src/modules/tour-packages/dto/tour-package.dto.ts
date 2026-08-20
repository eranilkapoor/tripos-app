import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTourPackageDto {
  @IsString() @MinLength(2) title!: string;
  @IsString() @MinLength(2) destination!: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() packageCode?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsString() destinationId?: string;
  @IsOptional() @IsString() supplierId?: string;
  @IsOptional() @IsString() audience?: string;
  @IsOptional() @IsString() packageType?: string;
  @IsOptional() @IsNumber() durationDays?: number;
  @IsOptional() @IsNumber() durationNights?: number;
  @IsOptional() @IsNumber() minTravellers?: number;
  @IsOptional() @IsNumber() maxTravellers?: number;
  @IsOptional() @IsNumber() basePrice?: number;
  @IsOptional() @IsNumber() basePriceMinor?: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsArray() inclusions?: string[];
  @IsOptional() @IsArray() exclusions?: string[];
  @IsOptional() @IsArray() themes?: string[];
  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsArray() departures?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() itinerary?: Array<Record<string, unknown>>;
  @IsOptional() @IsObject() costing?: Record<string, unknown>;
  @IsOptional() @IsObject() pricingRules?: Record<string, unknown>;
  @IsOptional() @IsObject() commissionPolicy?: Record<string, unknown>;
  @IsOptional() @IsObject() bookingRules?: Record<string, unknown>;
  @IsOptional() @IsObject() cancellationPolicy?: Record<string, unknown>;
  @IsOptional() @IsObject() changePolicy?: Record<string, unknown>;
  @IsOptional() @IsObject() seo?: Record<string, unknown>;
  @IsOptional() @IsObject() publishing?: Record<string, unknown>;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsObject() customFields?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() publishedAt?: string;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
