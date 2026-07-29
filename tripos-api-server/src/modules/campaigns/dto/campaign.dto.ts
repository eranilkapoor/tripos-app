import { IsNumber, IsObject, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCampaignDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) channel!: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsNumber() spend?: number;
  @IsOptional() @IsNumber() leads?: number;
  @IsOptional() @IsNumber() quotations?: number;
  @IsOptional() @IsNumber() bookings?: number;
  @IsOptional() @IsNumber() revenue?: number;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
