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
  @IsOptional() @IsString() bestSeason?: string;
  @IsOptional() @IsArray() highlights?: string[];
  @IsOptional() @IsString() visaRequirement?: string;
  @IsOptional() @IsObject() geo?: Record<string, unknown>;
  @IsOptional() @IsObject() content?: Record<string, unknown>;
  @IsOptional() @IsObject() travelAdvisory?: Record<string, unknown>;
  @IsOptional() @IsObject() seo?: Record<string, unknown>;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
