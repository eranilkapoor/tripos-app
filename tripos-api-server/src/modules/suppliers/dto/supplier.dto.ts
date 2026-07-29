import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) type!: string;
  @IsOptional() @IsString() destination?: string;
  @IsOptional() @IsArray() contacts?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() contracts?: Array<Record<string, unknown>>;
  @IsOptional() @IsArray() rates?: Array<Record<string, unknown>>;
  @IsOptional() @IsNumber() creditLimit?: number;
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
}
