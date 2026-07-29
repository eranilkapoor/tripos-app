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
  tenantScopedBody,
  tenantScopedQuery,
} from '../../../common/utils/tenant-scope.util';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import {
  AddSupplierConfirmationDto,
  AddSupplierContractDto,
  AddSupplierRateDto,
  CreateSupplierDto,
} from '../dto/supplier.dto';
import { SuppliersService } from '../services/suppliers.service';

@ApiTags('suppliers')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly service: SuppliersService) {}
  @Post() create(@Body() dto: CreateSupplierDto, @Req() request: Request) {
    return this.service.create(tenantScopedBody(dto, request));
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
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateSupplierDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.update(id, dto, tenantScopedQuery(query, request));
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
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.remove(id, tenantScopedQuery(query, request));
  }

  @Post(':id/contracts')
  addContract(
    @Param('id') id: string,
    @Body() dto: AddSupplierContractDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.addContract(id, dto, tenantScopedQuery(query, request));
  }

  @Post(':id/rates')
  addRate(
    @Param('id') id: string,
    @Body() dto: AddSupplierRateDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.addRate(id, dto, tenantScopedQuery(query, request));
  }

  @Post(':id/confirmations')
  addConfirmation(
    @Param('id') id: string,
    @Body() dto: AddSupplierConfirmationDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.addConfirmation(
      id,
      dto,
      tenantScopedQuery(query, request),
    );
  }
}
