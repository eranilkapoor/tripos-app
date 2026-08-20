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
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() dateOfBirth?: string;
  @IsOptional() @IsString() nationality?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() postalCode?: string;
  @IsOptional() @IsString() preferredLanguage?: string;
  @IsOptional() @IsString() preferredCurrency?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsString() assignedTo?: string;
  @IsOptional() @IsString() agentId?: string;
  @IsOptional() @IsString() companyName?: string;
  @IsOptional() @IsString() taxRegistrationNo?: string;
  @IsOptional() @IsString() externalReference?: string;
  @IsOptional() @IsArray() travellers?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() emergencyContacts?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() documents?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsObject() addressBook?: Record<string, unknown>;
  @IsOptional() @IsObject() preferences?: Record<string, unknown>;
  @IsOptional() @IsObject() consent?: Record<string, unknown>;
  @IsOptional() @IsObject() loyalty?: Record<string, unknown>;
  @IsOptional() @IsObject() riskProfile?: Record<string, unknown>;
  @IsOptional() @IsString() lastTravelledAt?: string;
  @IsOptional() @IsString() lastContactedAt?: string;
  @IsOptional() @IsObject() customFields?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
