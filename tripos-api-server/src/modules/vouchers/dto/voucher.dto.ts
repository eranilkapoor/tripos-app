import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateVoucherDto {
  @IsString() @MinLength(2) bookingId!: string;
  @IsString() @MinLength(2) customerName!: string;
  @IsString() @MinLength(2) voucherType!: string;
  @IsOptional() @IsString() supplierName?: string;
  @IsOptional() @IsString() issueDate?: string;
  @IsOptional() @IsString() confirmationNumber?: string;
  @IsOptional() @IsArray() lineItems?: Array<Record<string, unknown>>;
}
