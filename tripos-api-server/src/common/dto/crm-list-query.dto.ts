import { PaginationDto } from './pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class CrmListQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  status?: string;
}
