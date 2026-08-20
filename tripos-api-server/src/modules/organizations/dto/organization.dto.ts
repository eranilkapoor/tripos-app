import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateOrganizationDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) code!: string;
  @IsOptional() @IsString() legalName?: string;
  @IsOptional() @IsString() organizationType?: string;
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() primaryEmail?: string;
  @IsOptional() @IsString() primaryPhone?: string;
  @IsOptional() @IsString() timezone?: string;
  @IsOptional() @IsString() locale?: string;
  @IsOptional() @IsString() baseCurrency?: string;
  @IsOptional() @IsString() dataHostingMode?: string;
  @IsOptional() @IsArray() branches?: Array<Record<string, unknown>>;
  @IsOptional() @IsObject() syncPolicy?: Record<string, unknown>;
  @IsOptional() @IsObject() billingProfile?: Record<string, unknown>;
  @IsOptional() @IsObject() address?: Record<string, unknown>;
  @IsOptional() @IsObject() contacts?: Record<string, unknown>;
  @IsOptional() @IsObject() subscription?: Record<string, unknown>;
  @IsOptional() @IsObject() commercial?: Record<string, unknown>;
  @IsOptional() @IsObject() branding?: Record<string, unknown>;
  @IsOptional() @IsObject() compliance?: Record<string, unknown>;
  @IsOptional() @IsObject() securityPolicy?: Record<string, unknown>;
  @IsOptional() @IsObject() integrations?: Record<string, unknown>;
  @IsOptional() @IsObject() notificationPolicy?: Record<string, unknown>;
  @IsOptional() @IsObject() retentionPolicy?: Record<string, unknown>;
  @IsOptional() @IsObject() auditPolicy?: Record<string, unknown>;
  @IsOptional() @IsString() onboardedAt?: string;
  @IsOptional() @IsString() trialEndsAt?: string;
  @IsOptional() @IsString() suspendedAt?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
