import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePricingPlanDto {
  @IsString() code!: string;
  @IsString() name!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() audience?: string;
  @IsOptional() @IsString() billingCycle?: string;
  @IsOptional() @IsString() currencyCode?: string;
  @IsOptional() @IsNumber() @Min(0) priceMinor?: number;
  @IsOptional() @IsNumber() @Min(0) setupFeeMinor?: number;
  @IsOptional() @IsNumber() @Min(0) trialDays?: number;
  @IsOptional() @IsNumber() @Min(1) minSeats?: number;
  @IsOptional() @IsNumber() @Min(1) includedSeats?: number;
  @IsOptional() @IsNumber() @Min(0) extraSeatPriceMinor?: number;
  @IsOptional() @IsArray() features?: string[];
  @IsOptional() @IsObject() limits?: Record<string, unknown>;
  @IsOptional() @IsObject() providerPrices?: Record<string, unknown>;
  @IsOptional() @IsObject() terms?: Record<string, unknown>;
  @IsOptional() @IsObject() entitlements?: Record<string, unknown>;
  @IsOptional() @IsObject() supportPolicy?: Record<string, unknown>;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsString() publishedAt?: string;
  @IsOptional() @IsString() retiredAt?: string;
  @IsOptional() @IsString() status?: string;
}

export class SubscribeOrganizationDto {
  @IsString() planCode!: string;
  @IsOptional() @IsNumber() @Min(1) seats?: number;
  @IsOptional() @IsObject() billingProfile?: Record<string, unknown>;
  @IsOptional() @IsString() paymentProvider?: string;
  @IsOptional() @IsString() providerCustomerId?: string;
  @IsOptional() @IsString() providerSubscriptionId?: string;
  @IsOptional() @IsObject() paymentMethod?: Record<string, unknown>;
  @IsOptional() @IsString() graceEndsAt?: string;
  @IsOptional() @IsObject() usage?: Record<string, unknown>;
  @IsOptional() @IsArray() invoices?: Array<Record<string, unknown>>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CancelSubscriptionDto {
  @IsOptional() @IsString() reason?: string;
}
