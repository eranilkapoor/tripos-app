import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import {
  findScopedCrmRecord,
  listCrmRecords,
  updateScopedCrmRecord,
} from '../../../common/utils/crm-list.util';
import {
  AddB2BAgentCommissionDto,
  AddB2BAgentKycDocumentDto,
  AddB2BAgentWalletEntryDto,
  CreateB2BAgentDto,
  CreateB2BAgentInvoiceDto,
  UpdateB2BAgentCreditDto,
} from '../dto/b2b-agent.dto';
import { B2BAgent } from '../schemas/b2b-agent.schema';

@Injectable()
export class B2BAgentsService {
  constructor(
    @InjectModel(B2BAgent.name) private readonly model: Model<B2BAgent>,
  ) {}
  create(dto: CreateB2BAgentDto) {
    return this.model.create({
      ...dto,
      creditLimit: dto.creditLimit ?? 0,
      kycDocuments: dto.kycDocuments ?? [],
      walletLedger: [],
      commissionLedger: [],
      invoices: [],
    });
  }
  list(query: CrmListQueryDto) {
    return listCrmRecords(this.model, query, [
      'agencyName',
      'contactName',
      'email',
      'phone',
      'market',
    ]);
  }
  findOne(id: string, query: CrmListQueryDto) {
    return findScopedCrmRecord(this.model, id, query, 'B2B agent not found');
  }
  updateStatus(id: string, dto: StatusUpdateDto, query: CrmListQueryDto) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      { status: dto.status },
      'B2B agent not found',
    );
  }

  addKycDocument(
    id: string,
    dto: AddB2BAgentKycDocumentDto,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        $push: {
          kycDocuments: {
            ...dto,
            status: dto.status ?? 'received',
            receivedAt: new Date().toISOString(),
          },
        },
      },
      'B2B agent not found',
    );
  }

  updateCredit(
    id: string,
    dto: UpdateB2BAgentCreditDto,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        creditLimit: dto.creditLimit,
        $push: {
          walletLedger: {
            type: 'credit_limit_update',
            amount: dto.creditLimit,
            notes: dto.reason,
            createdAt: new Date().toISOString(),
          },
        },
      },
      'B2B agent not found',
    );
  }

  addCommission(
    id: string,
    dto: AddB2BAgentCommissionDto,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        $inc: { commissionEarned: dto.amount },
        $push: {
          commissionLedger: {
            ...dto,
            currencyCode: dto.currencyCode ?? 'INR',
            status: dto.status ?? 'earned',
            createdAt: new Date().toISOString(),
          },
        },
      },
      'B2B agent not found',
    );
  }

  addWalletEntry(
    id: string,
    dto: AddB2BAgentWalletEntryDto,
    query: CrmListQueryDto,
  ) {
    const receivableDelta =
      dto.type === 'collection' || dto.type === 'credit_note'
        ? -Math.abs(dto.amount)
        : Math.abs(dto.amount);
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        $inc: { receivable: receivableDelta },
        $push: {
          walletLedger: {
            ...dto,
            currencyCode: dto.currencyCode ?? 'INR',
            createdAt: new Date().toISOString(),
          },
        },
      },
      'B2B agent not found',
    );
  }

  createInvoice(
    id: string,
    dto: CreateB2BAgentInvoiceDto,
    query: CrmListQueryDto,
  ) {
    return updateScopedCrmRecord(
      this.model,
      id,
      query,
      {
        $inc: { receivable: dto.amount },
        $push: {
          invoices: {
            ...dto,
            currencyCode: dto.currencyCode ?? 'INR',
            status: dto.status ?? 'issued',
            issuedAt: new Date().toISOString(),
          },
        },
      },
      'B2B agent not found',
    );
  }
}
