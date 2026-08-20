import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreatePaymentDto {
  @IsOptional() @IsString() bookingId?: string;
  @IsOptional() @IsString() agentId?: string;
  @IsOptional() @IsString() invoiceId?: string;
  @IsOptional() @IsString() paymentNo?: string;
  @IsOptional() @IsString() supplierId?: string;
  @IsString() @MinLength(2) type!: string;
  @IsNumber() amount!: number;
  @IsOptional() @IsNumber() amountMinor?: number;
  @IsOptional() @IsString() currencyCode?: string;
  @IsOptional() @IsString() partyName?: string;
  @IsOptional() @IsString() dueDate?: string;
  @IsOptional() @IsString() paidAt?: string;
  @IsOptional() @IsString() paymentMode?: string;
  @IsOptional() @IsString() gatewayProvider?: string;
  @IsOptional() @IsString() gatewayReference?: string;
  @IsOptional() @IsString() bankReference?: string;
  @IsOptional() @IsObject() reconciliation?: Record<string, unknown>;
  @IsOptional() @IsObject() taxBreakup?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
