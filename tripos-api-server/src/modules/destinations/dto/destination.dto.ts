import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateDestinationDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) country!: string;
  @IsOptional() @IsString() region?: string;
  @IsOptional() @IsString() cityCode?: string;
  @IsOptional() @IsString() countryCode?: string;
  @IsOptional() @IsString() timezone?: string;
  @IsOptional() @IsString() bestSeason?: string;
  @IsOptional() @IsString() idealDuration?: string;
  @IsOptional() @IsString() popularityTier?: string;
  @IsOptional() @IsArray() highlights?: string[];
  @IsOptional() @IsArray() themes?: string[];
  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsString() visaRequirement?: string;
  @IsOptional() @IsObject() weather?: Record<string, unknown>;
  @IsOptional() @IsObject() currency?: Record<string, unknown>;
  @IsOptional() @IsObject() airport?: Record<string, unknown>;
  @IsOptional() @IsObject() geo?: Record<string, unknown>;
  @IsOptional() @IsObject() content?: Record<string, unknown>;
  @IsOptional() @IsObject() travelAdvisory?: Record<string, unknown>;
  @IsOptional() @IsObject() seo?: Record<string, unknown>;
  @IsOptional() @IsObject() publishing?: Record<string, unknown>;
  @IsOptional() @IsObject() supplierCoverage?: Record<string, unknown>;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
