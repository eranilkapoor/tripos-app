import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateRefundDto {
  @IsOptional() @IsString() bookingId?: string;
  @IsNumber() amount!: number;
  @IsOptional() @IsString() currencyCode?: string;
  @IsString() @MinLength(2) partyName!: string;
  @IsOptional() @IsString() reason?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
