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
  @IsOptional() @IsString() dataHostingMode?: string;
  @IsOptional() @IsArray() branches?: Array<Record<string, unknown>>;
  @IsOptional() @IsObject() syncPolicy?: Record<string, unknown>;
  @IsOptional() @IsObject() billingProfile?: Record<string, unknown>;
  @IsOptional() @IsObject() subscription?: Record<string, unknown>;
  @IsOptional() @IsObject() branding?: Record<string, unknown>;
  @IsOptional() @IsObject() compliance?: Record<string, unknown>;
  @IsOptional() @IsObject() securityPolicy?: Record<string, unknown>;
  @IsOptional() @IsObject() integrations?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
