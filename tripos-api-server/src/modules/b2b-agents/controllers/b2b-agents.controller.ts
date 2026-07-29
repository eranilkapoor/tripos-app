import {
  Body,
  Controller,
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
import { tenantScopedQuery } from '../../../common/utils/tenant-scope.util';
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
  @Post() create(@Body() dto: CreateB2BAgentDto) {
    return this.service.create(dto);
  }
  @Get()
  list(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.list(tenantScopedQuery(query, request));
  }
  @Get(':id') findOne(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findOne(id, tenantScopedQuery(query, request));
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
      tenantScopedQuery(query, request),
    );
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
      tenantScopedQuery(query, request),
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
      tenantScopedQuery(query, request),
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
      tenantScopedQuery(query, request),
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
      tenantScopedQuery(query, request),
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
      tenantScopedQuery(query, request),
    );
  }
}
