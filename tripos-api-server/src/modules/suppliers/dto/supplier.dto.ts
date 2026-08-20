import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) type!: string;
  @IsOptional() @IsString() destination?: string;
  @IsOptional() @IsString() supplierCode?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsArray() contacts?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() contracts?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() rates?: Array<Record<string, unknown>>;
  @IsOptional() @IsNumber() creditLimit?: number;
  @IsOptional() @IsObject() taxProfile?: Record<string, unknown>;
  @IsOptional() @IsObject() bankDetails?: Record<string, unknown>;
  @IsOptional() @IsObject() paymentTerms?: Record<string, unknown>;
  @IsOptional() @IsObject() compliance?: Record<string, unknown>;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsObject() customFields?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}

export class AddSupplierContractDto {
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsString() validFrom?: string;
  @IsOptional() @IsString() validTo?: string;
  @IsOptional() @IsString() currencyCode?: string;
  @IsOptional() @IsString() fileId?: string;
  @IsOptional() @IsObject() terms?: Record<string, unknown>;
}

export class AddSupplierRateDto {
  @IsString() @MinLength(2) serviceName!: string;
  @IsNumber() netRate!: number;
  @IsOptional() @IsString() currencyCode?: string;
  @IsOptional() @IsString() season?: string;
  @IsOptional() @IsObject() rules?: Record<string, unknown>;
}

export class AddSupplierConfirmationDto {
  @IsString() @MinLength(2) bookingId!: string;
  @IsString() @MinLength(2) serviceType!: string;
  @IsOptional() @IsString() confirmationNumber?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
