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
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsString() campaignCode?: string;
  @IsOptional() @IsString() startsAt?: string;
  @IsOptional() @IsString() endsAt?: string;
  @IsOptional() @IsObject() audience?: Record<string, unknown>;
  @IsOptional() @IsObject() budget?: Record<string, unknown>;
  @IsOptional() @IsNumber() spend?: number;
  @IsOptional() @IsNumber() leads?: number;
  @IsOptional() @IsNumber() quotations?: number;
  @IsOptional() @IsNumber() bookings?: number;
  @IsOptional() @IsNumber() revenue?: number;
  @IsOptional() @IsObject() attribution?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
