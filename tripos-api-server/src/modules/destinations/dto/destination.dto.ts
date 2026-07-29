import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDestinationDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) country!: string;
  @IsOptional() @IsString() region?: string;
  @IsOptional() @IsString() bestSeason?: string;
  @IsOptional() @IsArray() highlights?: string[];
  @IsOptional() @IsString() visaRequirement?: string;
}
