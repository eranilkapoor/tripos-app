import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateDemoLeadDto } from "./create-demo-lead.dto";
import { CreateRecordDto } from "./create-record.dto";
import { TriposRecord } from "./tripos-record.schema";
import { CreateInvoiceDto } from "./create-invoice.dto";
import { TriposInvoice } from "./tripos-invoice.schema";

@Injectable()
export class TriposService {
  private readonly demoLeads: Array<CreateDemoLeadDto & { id: string; source: string; stage: string }> = [];

  constructor(
    @InjectModel(TriposRecord.name)
    private readonly recordModel: Model<TriposRecord>,
    @InjectModel(TriposInvoice.name)
    private readonly invoiceModel: Model<TriposInvoice>,
  ) {}

  health() {
    return {
      service: "tripos-api-server",
      status: "ok",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
    };
  }

  dashboard() {
    return {
      tenant: "Webnza Travels Demo",
      branch: "Delhi",
      metrics: [
        { label: "New Leads", value: "38", helper: "+12 today" },
        { label: "Open Quotes", value: "INR 18.2L", helper: "14 awaiting approval" },
        { label: "Trips Active", value: "22", helper: "7 start this week" },
        { label: "Gross Profit", value: "INR 12.4L", helper: "29% margin" },
      ],
      pipeline: ["New", "Requirement", "Quotation", "Advance", "Booking", "Operations", "Completed"],
    };
  }

  modules() {
    return [
      "identity",
      "tenant",
      "crm",
      "quotation",
      "itinerary",
      "booking",
      "supplier",
      "operations",
      "b2b-agent-management",
      "finance",
      "marketing",
      "communication",
      "reporting",
      "ai",
    ];
  }

  leads() {
    return this.records("leads").then((records) => records.length ? records : [
      { id: "lead-1", customer: "Sharma Family", destination: "Dubai", source: "Website", stage: "Requirement", owner: "Ritika" },
      { id: "lead-2", customer: "Mehta Group", destination: "Singapore", source: "B2B Agent", stage: "Quotation Sent", owner: "Aman" },
      { id: "lead-3", customer: "Corporate Offsite", destination: "Goa", source: "LinkedIn", stage: "New", owner: "Unassigned" },
    ]);
  }

  quotations() {
    return this.records("quotations").then((records) => records.length ? records : [
      { id: "Q-1029", customer: "Sharma Family", destination: "Dubai", internalCost: 100000, sellingPrice: 129500, status: "Sent" },
      { id: "Q-1030", customer: "Mehta Group", destination: "Singapore", internalCost: 720000, sellingPrice: 864000, status: "Draft" },
    ]);
  }

  bookings() {
    return this.records("bookings").then((records) => records.length ? records : [
      { id: "BKG-2081", customer: "Sharma Family", destination: "Dubai", travelDates: "25 Dec - 30 Dec", status: "Confirmed" },
      { id: "BKG-2082", customer: "Mehta Group", destination: "Singapore", travelDates: "12 Aug - 15 Aug", status: "Part Confirmed" },
    ]);
  }

  operations() {
    return this.records("operations").then((records) => records.length ? records : [
      { id: "OPS-551", customer: "Sharma Family", service: "Airport Pickup", supplier: "DXB Prime Cars", status: "Assigned" },
      { id: "OPS-552", customer: "Sharma Family", service: "Burj Khalifa", supplier: "Dubai Tickets Co", status: "Confirmed" },
    ]);
  }

  b2bAgents() {
    return this.records("b2b-agents").then((records) => records.length ? records : [
      { id: "agent-1", name: "Skyline Travels", market: "Delhi", creditLimit: 1000000, receivable: 240000, status: "Active" },
      { id: "agent-2", name: "Pearl Holidays", market: "Mumbai", creditLimit: 500000, receivable: 76000, status: "KYC Review" },
    ]);
  }

  suppliers() {
    return this.records("suppliers").then((records) => records.length ? records : [
      { id: "supplier-1", name: "Hotel ABC", type: "Hotel", destination: "Dubai", rating: 4.6 },
      { id: "supplier-2", name: "DXB Prime Cars", type: "Transport", destination: "Dubai", rating: 4.8 },
    ]);
  }

  finance() {
    return {
      receivables: 850000,
      payables: 620000,
      grossProfit: 1240000,
      marginPercent: 29,
      bookings: [
        { bookingId: "BKG-2081", sellingPrice: 129500, supplierCost: 100000, netProfit: 25000 },
        { bookingId: "BKG-2082", sellingPrice: 864000, supplierCost: 720000, netProfit: 91000 },
      ],
    };
  }

  createDemoLead(dto: CreateDemoLeadDto) {
    const lead = {
      ...dto,
      id: `demo-${this.demoLeads.length + 1}`,
      source: "public-website",
      stage: "New",
    };
    this.demoLeads.push(lead);
    void this.createRecord({
      moduleKey: "leads",
      title: dto.companyName,
      status: "new",
      priority: "high",
      payload: {
        contactName: dto.contactName,
        email: dto.email,
        phone: dto.phone,
        businessType: dto.businessType,
        monthlyBookings: dto.monthlyBookings,
        source: "public-website",
      },
    });
    return {
      message: "Demo lead captured in TripOS CRM.",
      lead,
    };
  }

  async records(moduleKey?: string) {
    const query = moduleKey ? { moduleKey } : {};
    const records = await this.recordModel.find(query).sort({ updatedAt: -1 }).lean().exec();
    return records.map((record) => ({
      id: String(record._id),
      moduleKey: record.moduleKey,
      title: record.title,
      status: record.status,
      priority: record.priority,
      payload: record.payload,
    }));
  }

  async createRecord(dto: CreateRecordDto) {
    const record = await this.recordModel.create({
      moduleKey: dto.moduleKey,
      title: dto.title,
      status: dto.status ?? "open",
      priority: dto.priority ?? "medium",
      payload: dto.payload ?? {},
    });
    return {
      message: "TripOS record created.",
      record: {
        id: String(record._id),
        moduleKey: record.moduleKey,
        title: record.title,
        status: record.status,
        priority: record.priority,
        payload: record.payload,
      },
    };
  }

  async invoices() {
    return this.invoiceModel.find().sort({ updatedAt: -1 }).lean().exec();
  }

  async nextInvoiceNumber(series: string) {
    const invoices = await this.invoiceModel
      .find({ invoiceSeries: series })
      .select({ invoiceNo: 1 })
      .lean()
      .exec();
    const maxLength = Math.max(4, ...invoices.map((invoice) => String(invoice.invoiceNo).length));
    const maxNumber = Math.max(0, ...invoices.map((invoice) => Number(invoice.invoiceNo) || 0));
    return {
      invoiceSeries: series,
      invoiceNo: String(maxNumber + 1).padStart(maxLength, "0"),
    };
  }

  async createInvoice(dto: CreateInvoiceDto) {
    const totals = calculateInvoiceTotals(dto.entries, dto.taxRate);
    const invoice = await this.invoiceModel.create({
      ...dto,
      totals,
      status: dto.status ?? "draft",
      locked: dto.locked ?? false,
    });
    await this.createRecord({
      moduleKey: "finance",
      title: `${dto.invoiceSeries}${dto.invoiceNo} ${String(dto.customer.companyName ?? "Customer")}`,
      status: dto.status ?? "draft",
      priority: "medium",
      payload: {
        countryCode: dto.countryCode,
        currencyCode: dto.currencyCode,
        totalPayable: totals.totalPayable,
        taxLabel: dto.taxLabel,
        taxRate: dto.taxRate,
      },
    });
    return {
      message: "TripOS invoice saved.",
      invoice,
    };
  }
}

function calculateInvoiceTotals(entries: Array<Record<string, unknown>>, taxRate: number) {
  const subtotal = entries.reduce((sum, entry) => sum + Number(entry.total ?? 0), 0);
  const taxAmount = subtotal * (Number(taxRate || 0) / 100);
  return {
    subtotal,
    taxAmount,
    taxBasis: subtotal,
    totalPayable: subtotal + taxAmount,
  };
}
