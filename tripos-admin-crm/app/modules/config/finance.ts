import type { CrmModule } from "../../components/crmTypes";

const financeModules: CrmModule[] = [
  {
    id: "payments",
    title: "Payments",
    group: "Finance",
    endpoint: "payments",
    description:
      "Receivables, payables, agent collections, supplier dues, refunds, due dates, and payment status.",
    columns: ["Type", "Party", "Amount", "Currency", "Due", "Status"],
    rowMap: [
      "type",
      "partyName",
      "amount",
      "currencyCode",
      "dueDate",
      "status",
    ],
    statusOptions: ["pending", "partial", "paid", "overdue", "cancelled"],
    fields: [
      {
        key: "type",
        label: "Type",
        required: true,
        type: "select",
        options: ["receivable", "payable", "refund", "commission"],
      },
      { key: "partyName", label: "Party" },
      { key: "amount", label: "Amount", required: true, type: "number" },
      { key: "currencyCode", label: "Currency" },
      { key: "bookingId", label: "Booking ID" },
      { key: "dueDate", label: "Due Date", type: "date" },
    ],
  },
  {
    id: "invoices",
    title: "Invoice Builder",
    group: "Finance",
    endpoint: "finance/invoices",
    description:
      "Country-aware invoice utility with provider, customer, tax rules, dynamic line items, and API persistence.",
    columns: ["Invoice", "Customer", "Country", "Tax", "Total", "Status"],
    rowMap: [
      "invoiceNo",
      "customer.companyName",
      "countryCode",
      "taxLabel",
      "totalPayable",
      "status",
    ],
    fields: [],
  },
  {
    id: "finance-reports",
    title: "Finance Reports",
    group: "Finance",
    endpoint: "reporting/finance",
    description:
      "Organization-scoped finance totals across receivables, payables, refunds, commissions, and total movement.",
    columns: ["Metric", "Value"],
    rowMap: ["key", "value"],
    fields: [],
  },
  {
    id: "sales-reports",
    title: "Sales Reports",
    group: "Reports",
    endpoint: "reporting/sales-funnel",
    description:
      "Lead, quotation, and booking funnel summaries grouped by status and stage.",
    columns: ["Metric", "Value"],
    rowMap: ["key", "value"],
    fields: [],
  },
  {
    id: "operations-reports",
    title: "Operations Reports",
    group: "Reports",
    endpoint: "reporting/operations",
    description:
      "Operations task workload grouped by status and priority for branch managers.",
    columns: ["Metric", "Value"],
    rowMap: ["key", "value"],
    fields: [],
  },
  {
    id: "saved-reports",
    title: "Saved Reports",
    group: "Reports",
    endpoint: "saved-reports",
    description:
      "Reusable scheduled report templates for overview, sales funnel, operations, and finance reporting.",
    columns: ["Report", "Type", "Schedule", "Recipients", "Status", "Last Run"],
    rowMap: [
      "name",
      "reportType",
      "schedule",
      "recipients",
      "status",
      "lastRunAt",
    ],
    statusOptions: ["active", "paused", "archived"],
    fields: [
      { key: "name", label: "Report Name", required: true },
      {
        key: "reportType",
        label: "Report Type",
        required: true,
        type: "select",
        options: ["overview", "sales-funnel", "operations", "finance"],
      },
      { key: "recipients", label: "Recipients", type: "tags" },
    ],
  },
];

export default financeModules;
