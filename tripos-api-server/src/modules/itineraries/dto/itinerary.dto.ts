import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateItineraryDto {
  @IsOptional() @IsString() quotationId?: string;
  @IsString() @MinLength(2) title!: string;
  @IsString() @MinLength(2) destination!: string;
  @IsOptional() @IsArray() days?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}

export class UpsertItineraryDayDto {
  @IsOptional() @IsString() id?: string;
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsArray() items?: Array<Record<string, unknown>>;
}

export class UpsertItineraryItemDto {
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsString() time?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() notes?: string;
}
