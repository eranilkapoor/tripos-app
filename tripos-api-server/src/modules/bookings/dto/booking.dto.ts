import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateBookingDto {
  @IsOptional() @IsString() quotationId?: string;
  @IsOptional() @IsString() leadId?: string;
  @IsString() @MinLength(2) customerName!: string;
  @IsString() @MinLength(2) destination!: string;
  @IsOptional() @IsString() travelDates?: string;
  @IsOptional() @IsArray() passengers?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() services?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() documents?: Array<Record<string, unknown>>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}

export class ConvertQuotationToBookingDto {
  @IsOptional() @IsArray() passengers?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() services?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() documents?: Array<Record<string, unknown>>;
  @IsOptional() @IsString() status?: string;
}

export class AddBookingPassengerDto {
  @IsString() @MinLength(2) name!: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() dateOfBirth?: string;
  @IsOptional() @IsString() passportNumber?: string;
  @IsOptional() @IsString() nationality?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class AddBookingPaymentScheduleDto {
  @IsString() @MinLength(2) label!: string;
  @IsNumber() amount!: number;
  @IsOptional() @IsString() currencyCode?: string;
  @IsOptional() @IsString() dueDate?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class AddBookingVoucherDto {
  @IsString() @MinLength(2) supplierName!: string;
  @IsString() @MinLength(2) serviceType!: string;
  @IsOptional() @IsString() voucherNumber?: string;
  @IsOptional() @IsString() fileId?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
