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
  @IsString() @MinLength(2) type!: string;
  @IsNumber() amount!: number;
  @IsOptional() @IsNumber() amountMinor?: number;
  @IsOptional() @IsString() currencyCode?: string;
  @IsOptional() @IsString() partyName?: string;
  @IsOptional() @IsString() dueDate?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
