import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTourPackageDto {
  @IsString() @MinLength(2) title!: string;
  @IsString() @MinLength(2) destination!: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsNumber() durationDays?: number;
  @IsOptional() @IsNumber() basePrice?: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsArray() inclusions?: string[];
  @IsOptional() @IsArray() exclusions?: string[];
  @IsOptional() @IsArray() itinerary?: Array<Record<string, unknown>>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
