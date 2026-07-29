import { Injectable } from "@nestjs/common";
import { CreateDemoLeadDto } from "./create-demo-lead.dto";

@Injectable()
export class TriposService {
  private readonly demoLeads: Array<CreateDemoLeadDto & { id: string; source: string; stage: string }> = [];

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
    return [
      { id: "lead-1", customer: "Sharma Family", destination: "Dubai", source: "Website", stage: "Requirement", owner: "Ritika" },
      { id: "lead-2", customer: "Mehta Group", destination: "Singapore", source: "B2B Agent", stage: "Quotation Sent", owner: "Aman" },
      { id: "lead-3", customer: "Corporate Offsite", destination: "Goa", source: "LinkedIn", stage: "New", owner: "Unassigned" },
    ];
  }

  quotations() {
    return [
      { id: "Q-1029", customer: "Sharma Family", destination: "Dubai", internalCost: 100000, sellingPrice: 129500, status: "Sent" },
      { id: "Q-1030", customer: "Mehta Group", destination: "Singapore", internalCost: 720000, sellingPrice: 864000, status: "Draft" },
    ];
  }

  bookings() {
    return [
      { id: "BKG-2081", customer: "Sharma Family", destination: "Dubai", travelDates: "25 Dec - 30 Dec", status: "Confirmed" },
      { id: "BKG-2082", customer: "Mehta Group", destination: "Singapore", travelDates: "12 Aug - 15 Aug", status: "Part Confirmed" },
    ];
  }

  operations() {
    return [
      { id: "OPS-551", customer: "Sharma Family", service: "Airport Pickup", supplier: "DXB Prime Cars", status: "Assigned" },
      { id: "OPS-552", customer: "Sharma Family", service: "Burj Khalifa", supplier: "Dubai Tickets Co", status: "Confirmed" },
    ];
  }

  b2bAgents() {
    return [
      { id: "agent-1", name: "Skyline Travels", market: "Delhi", creditLimit: 1000000, receivable: 240000, status: "Active" },
      { id: "agent-2", name: "Pearl Holidays", market: "Mumbai", creditLimit: 500000, receivable: 76000, status: "KYC Review" },
    ];
  }

  suppliers() {
    return [
      { id: "supplier-1", name: "Hotel ABC", type: "Hotel", destination: "Dubai", rating: 4.6 },
      { id: "supplier-2", name: "DXB Prime Cars", type: "Transport", destination: "Dubai", rating: 4.8 },
    ];
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
    return {
      message: "Demo lead captured in TripOS CRM.",
      lead,
    };
  }
}

