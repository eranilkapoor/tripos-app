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
  @IsOptional() @IsString() customerId?: string;
  @IsOptional() @IsString() bookingNo?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsString() agentId?: string;
  @IsOptional() @IsString() supplierCoordinatorId?: string;
  @IsOptional() @IsString() operationsOwnerId?: string;
  @IsOptional() @IsString() financeOwnerId?: string;
  @IsString() @MinLength(2) customerName!: string;
  @IsString() @MinLength(2) destination!: string;
  @IsOptional() @IsString() travelDates?: string;
  @IsOptional() @IsString() bookingDate?: string;
  @IsOptional() @IsString() departureDate?: string;
  @IsOptional() @IsString() returnDate?: string;
  @IsOptional() @IsArray() passengers?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() services?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() documents?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() operationChecklist?: Array<Record<string, unknown>>;
  @IsOptional() @IsObject() commercial?: Record<string, unknown>;
  @IsOptional() @IsObject() supplierCosting?: Record<string, unknown>;
  @IsOptional() @IsObject() paymentSummary?: Record<string, unknown>;
  @IsOptional() @IsObject() operationsSummary?: Record<string, unknown>;
  @IsOptional() @IsObject() cancellationPolicy?: Record<string, unknown>;
  @IsOptional() @IsArray() statusHistory?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() supplierConfirmations?: Array<
    Record<string, unknown>
  >;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsObject() customFields?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
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
