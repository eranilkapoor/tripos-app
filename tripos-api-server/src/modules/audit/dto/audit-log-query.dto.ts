import { IsOptional, IsString } from 'class-validator';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';

export class AuditLogQueryDto extends CrmListQueryDto {
  @IsOptional() @IsString() actorId?: string;
  @IsOptional() @IsString() action?: string;
  @IsOptional() @IsString() outcome?: string;
  @IsOptional() @IsString() from?: string;
  @IsOptional() @IsString() to?: string;
}
