import {
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString() @MinLength(2) name!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() customerType?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsString() externalReference?: string;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsObject() preferences?: Record<string, unknown>;
  @IsOptional() @IsObject() consent?: Record<string, unknown>;
  @IsOptional() @IsObject() loyalty?: Record<string, unknown>;
  @IsOptional() @IsObject() customFields?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
