import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class AiAssistantDto {
  @IsString() @MinLength(2) prompt!: string;
  @IsOptional() @IsString() destination?: string;
  @IsOptional() @IsString() travelDates?: string;
  @IsOptional() @IsString() customerType?: string;
  @IsOptional() @IsArray() interests?: string[];
  @IsOptional() @IsObject() context?: Record<string, unknown>;
}
