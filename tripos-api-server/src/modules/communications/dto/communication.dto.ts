import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCommunicationDto {
  @IsOptional() @IsString() organizationId?: string;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsString() channel?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() entityType?: string;
  @IsOptional() @IsString() entityId?: string;
  @IsString() @MinLength(3) recipient!: string;
  @IsOptional() @IsString() sender?: string;
  @IsOptional() @IsString() recipientName?: string;
  @IsOptional() @IsString() subject?: string;
  @IsOptional() @IsString() templateCode?: string;
  @IsOptional() @IsString() provider?: string;
  @IsOptional() @IsString() providerMessageId?: string;
  @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @IsOptional() @IsObject() delivery?: Record<string, unknown>;
  @IsOptional() @IsArray() events?: Array<Record<string, unknown>>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsString() scheduledAt?: string;
  @IsOptional() @IsString() sentAt?: string;
  @IsOptional() @IsString() deliveredAt?: string;
  @IsOptional() @IsString() failedAt?: string;
  @IsOptional() @IsString() failureReason?: string;
}
