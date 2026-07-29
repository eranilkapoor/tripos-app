import { IsString, MinLength } from 'class-validator';

export class StatusUpdateDto {
  @IsString()
  @MinLength(2)
  status!: string;
}

