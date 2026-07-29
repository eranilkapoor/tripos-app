import { IsIn, IsObject, IsOptional, IsString, MinLength } from "class-validator";

export class CreateRecordDto {
  @IsString()
  @MinLength(2)
  moduleKey!: string;

  @IsString()
  @MinLength(2)
  title!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsIn(["low", "medium", "high", "urgent"])
  priority?: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
