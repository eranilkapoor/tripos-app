import { IsArray, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateB2BAgentDto {
  @IsString() @MinLength(2) agencyName!: string;
  @IsOptional() @IsString() contactName?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() market?: string;
  @IsOptional() @IsNumber() creditLimit?: number;
  @IsOptional() @IsArray() kycDocuments?: Array<Record<string, unknown>>;
}

