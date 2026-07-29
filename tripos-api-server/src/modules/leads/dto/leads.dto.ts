import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class TravelRequirementDto {
  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsString()
  travelDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  adults?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  children?: number;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsOptional()
  @IsString()
  duration?: string;
}

export class CreateLeadDto {
  @IsString()
  @MinLength(2)
  customerName!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  source!: string;

  @IsOptional()
  @IsEnum(['b2c', 'b2b', 'corporate'])
  channel?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TravelRequirementDto)
  requirement?: TravelRequirementDto;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  branchId?: string;
}

export class UpdateLeadStageDto {
  @IsEnum([
    'new',
    'assigned',
    'contacted',
    'requirement_collected',
    'quotation_prepared',
    'quotation_sent',
    'negotiation',
    'won',
    'lost',
    'duplicate',
  ])
  stage!: string;
}

export class AssignLeadDto {
  @IsString()
  @MinLength(2)
  assignedTo!: string;
}

export class AddLeadActivityDto {
  @IsOptional()
  @IsEnum(['note_added', 'lead_created', 'assignment_changed', 'stage_changed'])
  type?: string;

  @IsString()
  @MinLength(2)
  subject!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class LeadListQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  stage?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  branchId?: string;
}
