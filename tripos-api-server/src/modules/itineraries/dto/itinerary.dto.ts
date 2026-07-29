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
