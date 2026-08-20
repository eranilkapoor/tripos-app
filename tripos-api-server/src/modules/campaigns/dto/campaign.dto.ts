import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCampaignDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) channel!: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsString() medium?: string;
  @IsOptional() @IsString() campaignType?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsString() segmentId?: string;
  @IsOptional() @IsString() landingPageUrl?: string;
  @IsOptional() @IsString() campaignCode?: string;
  @IsOptional() @IsString() startsAt?: string;
  @IsOptional() @IsString() endsAt?: string;
  @IsOptional() @IsObject() audience?: Record<string, unknown>;
  @IsOptional() @IsObject() budget?: Record<string, unknown>;
  @IsOptional() @IsObject() goals?: Record<string, unknown>;
  @IsOptional() @IsObject() content?: Record<string, unknown>;
  @IsOptional() @IsObject() schedule?: Record<string, unknown>;
  @IsOptional() @IsNumber() spend?: number;
  @IsOptional() @IsNumber() impressions?: number;
  @IsOptional() @IsNumber() clicks?: number;
  @IsOptional() @IsNumber() leads?: number;
  @IsOptional() @IsNumber() quotations?: number;
  @IsOptional() @IsNumber() bookings?: number;
  @IsOptional() @IsNumber() revenue?: number;
  @IsOptional() @IsNumber() costPerLead?: number;
  @IsOptional() @IsNumber() roi?: number;
  @IsOptional() @IsObject() attribution?: Record<string, unknown>;
  @IsOptional() @IsObject() provider?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
