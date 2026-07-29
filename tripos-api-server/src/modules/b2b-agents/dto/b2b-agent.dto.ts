import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateB2BAgentDto {
  @IsString() @MinLength(2) agencyName!: string;
  @IsOptional() @IsString() contactName?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() market?: string;
  @IsOptional() @IsNumber() creditLimit?: number;
  @IsOptional() @IsArray() kycDocuments?: Array<Record<string, unknown>>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}

export class AddB2BAgentKycDocumentDto {
  @IsString() @MinLength(2) documentType!: string;
  @IsOptional() @IsString() documentNumber?: string;
  @IsOptional() @IsString() fileId?: string;
  @IsOptional() @IsString() status?: string;
}

export class UpdateB2BAgentCreditDto {
  @IsNumber() creditLimit!: number;
  @IsOptional() @IsString() reason?: string;
}

export class AddB2BAgentCommissionDto {
  @IsString() @MinLength(2) bookingId!: string;
  @IsNumber() amount!: number;
  @IsOptional() @IsString() currencyCode?: string;
  @IsOptional() @IsString() status?: string;
}

export class AddB2BAgentWalletEntryDto {
  @IsString() @MinLength(2) type!: string;
  @IsNumber() amount!: number;
  @IsOptional() @IsString() currencyCode?: string;
  @IsOptional() @IsString() reference?: string;
  @IsOptional() @IsString() notes?: string;
}

export class CreateB2BAgentInvoiceDto {
  @IsString() @MinLength(2) invoiceNo!: string;
  @IsNumber() amount!: number;
  @IsOptional() @IsString() currencyCode?: string;
  @IsOptional() @IsString() dueDate?: string;
  @IsOptional() @IsString() status?: string;
}
