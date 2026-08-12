import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { CreateLeadDto } from '../dto/leads.dto';
import { LeadsService } from '../services/leads.service';

@ApiTags('public-leads')
@Public()
@Controller('public/leads')
export class PublicLeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(
    @Body() dto: CreateLeadDto,
    @Headers('x-public-intake-token') intakeToken?: string,
  ) {
    if (!isPublicIntakeAllowed(intakeToken)) {
      throw new UnauthorizedException('Invalid public intake token');
    }
    return this.leadsService.create({
      ...dto,
      organizationId: publicOrganizationId(),
      branchId: publicBranchId(),
      source: dto.source || 'public-website',
      channel: dto.channel || 'b2c',
    });
  }
}

function isPublicIntakeAllowed(intakeToken?: string) {
  const expected = process.env.PUBLIC_LEAD_INTAKE_TOKEN;
  if (process.env.NODE_ENV !== 'production' && !expected) return true;
  return Boolean(expected && intakeToken && intakeToken === expected);
}

function publicOrganizationId() {
  return process.env.PUBLIC_LEAD_ORGANIZATION_ID ?? 'demo-org';
}

function publicBranchId() {
  return process.env.PUBLIC_LEAD_BRANCH_ID ?? 'main';
}
