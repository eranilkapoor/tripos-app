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
}
