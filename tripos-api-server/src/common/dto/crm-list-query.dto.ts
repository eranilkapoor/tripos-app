import { PaginationDto } from './pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class CrmListQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  branchId?: string;
}
