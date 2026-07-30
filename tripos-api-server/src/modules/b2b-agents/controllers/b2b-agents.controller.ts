import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import {
  organizationScopedBody,
  organizationScopedQuery,
} from '../../../common/utils/organization-scope.util';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import {
  AddB2BAgentCommissionDto,
  AddB2BAgentKycDocumentDto,
  AddB2BAgentWalletEntryDto,
  CreateB2BAgentDto,
  CreateB2BAgentInvoiceDto,
  UpdateB2BAgentCreditDto,
} from '../dto/b2b-agent.dto';
import { B2BAgentsService } from '../services/b2b-agents.service';

@ApiTags('b2b-agents')
@Controller('b2b-agents')
export class B2BAgentsController {
  constructor(private readonly service: B2BAgentsService) {}
  @Post() create(@Body() dto: CreateB2BAgentDto, @Req() request: Request) {
    return this.service.create(organizationScopedBody(dto, request));
  }
  @Get()
  list(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.list(organizationScopedQuery(query, request));
  }
  @Get(':id') findOne(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findOne(id, organizationScopedQuery(query, request));
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateB2BAgentDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.update(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }
  @Patch(':id/status') updateStatus(
    @Param('id') id: string,
    @Body() dto: StatusUpdateDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateStatus(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.remove(id, organizationScopedQuery(query, request));
  }

  @Post(':id/kyc-documents')
  addKycDocument(
    @Param('id') id: string,
    @Body() dto: AddB2BAgentKycDocumentDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.addKycDocument(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Patch(':id/credit-limit')
  updateCredit(
    @Param('id') id: string,
    @Body() dto: UpdateB2BAgentCreditDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateCredit(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Post(':id/commissions')
  addCommission(
    @Param('id') id: string,
    @Body() dto: AddB2BAgentCommissionDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.addCommission(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Post(':id/wallet')
  addWalletEntry(
    @Param('id') id: string,
    @Body() dto: AddB2BAgentWalletEntryDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.addWalletEntry(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Post(':id/invoices')
  createInvoice(
    @Param('id') id: string,
    @Body() dto: CreateB2BAgentInvoiceDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.createInvoice(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }
}
