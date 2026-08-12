import type { CrmModule } from "../../components/crmTypes";

const operationsModules: CrmModule[] = [
  {
    id: "operations",
    title: "Operations",
    group: "Operations",
    endpoint: "operations",
    description:
      "DMC execution tasks for hotels, transfers, visas, tickets, guides, confirmations, and supplier follow-ups.",
    columns: ["Task", "Booking", "Service", "Owner", "Due", "Status"],
    rowMap: [
      "title",
      "bookingId",
      "serviceType",
      "assignedTo",
      "dueAt",
      "status",
    ],
    statusOptions: [
      "pending",
      "assigned",
      "confirmed",
      "in_progress",
      "blocked",
      "completed",
    ],
    fields: [
      { key: "title", label: "Task", required: true },
      { key: "bookingId", label: "Booking ID" },
      { key: "serviceType", label: "Service", required: true },
      { key: "assignedTo", label: "Owner" },
      { key: "dueAt", label: "Due Date", type: "date" },
      {
        key: "payload.priority",
        label: "Priority",
        type: "select",
        options: ["low", "medium", "high", "urgent"],
      },
    ],
  },
  {
    id: "suppliers",
    title: "Suppliers",
    group: "Inventory",
    endpoint: "suppliers",
    description:
      "Hotels, transporters, activity vendors, guides, DMC partners, contracts, credit limits, ratings, and payables.",
    columns: [
      "Supplier",
      "Type",
      "Destination",
      "Credit Limit",
      "Rating",
      "Status",
    ],
    rowMap: ["name", "type", "destination", "creditLimit", "rating", "status"],
    statusOptions: ["active", "inactive", "blacklisted"],
    fields: [
      { key: "name", label: "Supplier", required: true },
      { key: "type", label: "Type", required: true },
      { key: "destination", label: "Destination" },
      { key: "creditLimit", label: "Credit Limit", type: "number" },
      { key: "rating", label: "Rating", type: "number" },
    ],
  },
  {
    id: "b2b-agents",
    title: "B2B Agents",
    group: "Partners",
    endpoint: "b2b-agents",
    description:
      "Agent onboarding, KYC status, market, credit limit, commission, receivables, and partner activity.",
    columns: [
      "Agency",
      "Contact",
      "Market",
      "Credit Limit",
      "Commission",
      "Status",
    ],
    rowMap: [
      "agencyName",
      "contactName",
      "market",
      "creditLimit",
      "commissionRate",
      "status",
    ],
    statusOptions: ["pending_kyc", "active", "on_hold", "blocked"],
    fields: [
      { key: "agencyName", label: "Agency", required: true },
      { key: "contactName", label: "Contact", required: true },
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Phone" },
      { key: "market", label: "Market" },
      { key: "creditLimit", label: "Credit Limit", type: "number" },
      { key: "commissionRate", label: "Commission %", type: "number" },
    ],
  },
];

export default operationsModules;
