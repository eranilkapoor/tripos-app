"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faArrowRotateRight,
  faChevronLeft,
  faChevronRight,
  faBell,
  faBuilding,
  faCodeBranch,
  faDesktop,
  faDownload,
  faFileExcel,
  faFileImport,
  faFilePdf,
  faFileWord,
  faFolderOpen,
  faMoon,
  faPlus,
  faRightFromBracket,
  faSearch,
  faSun,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import type { ApiRecord, CrmModule, CrmSession, ModuleField } from "./crmTypes";
import {
  apiBaseUrl,
  formatDisplayValue,
  getRecordId,
  normalizeRecords,
  optionLabel,
  optionValue,
  recordToRow,
  sessionHeaders,
  statusClass,
  toPayload,
} from "./crmUtils";

const modules: CrmModule[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    group: "Overview",
    description:
      "Live operating view across sales, bookings, operations, partners, suppliers, documents, support, and finance.",
    columns: ["Signal", "Value", "Owner", "Status"],
    rowMap: [],
    fields: [],
  },
  {
    id: "leads",
    title: "Leads",
    group: "Sales",
    endpoint: "leads",
    description:
      "Capture B2C, B2B, corporate, campaign, phone, WhatsApp, referral, and website enquiries.",
    columns: ["Customer", "Destination", "Source", "Stage", "Owner", "Phone"],
    rowMap: [
      "customerName",
      "requirement.destination",
      "source",
      "stage",
      "assignedTo",
      "phone",
    ],
    stageEndpoint: true,
    statusOptions: [
      "new",
      "assigned",
      "contacted",
      "requirement_collected",
      "quotation_prepared",
      "quotation_sent",
      "negotiation",
      "won",
      "lost",
    ],
    fields: [
      { key: "customerName", label: "Customer", required: true },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email", type: "email" },
      {
        key: "source",
        label: "Source",
        required: true,
        placeholder: "Website, WhatsApp, Agent",
      },
      {
        key: "channel",
        label: "Channel",
        type: "select",
        options: [
          { value: "b2c", label: "B2C Customer" },
          { value: "b2b", label: "B2B Agent" },
          { value: "corporate", label: "Corporate Client" },
        ],
      },
      { key: "requirement.destination", label: "Destination" },
      { key: "requirement.travelDate", label: "Travel Date", type: "date" },
      { key: "requirement.adults", label: "Adults", type: "number" },
      { key: "assignedTo", label: "Owner" },
    ],
  },
  {
    id: "customers",
    title: "Customers",
    group: "Sales",
    endpoint: "customers",
    description:
      "Customer master for B2C travellers, repeat customers, families, and corporate contacts.",
    columns: ["Customer", "Phone", "Email", "Type", "City", "Status"],
    rowMap: ["name", "phone", "email", "customerType", "city", "status"],
    statusOptions: ["active", "inactive", "blocked"],
    fields: [
      { key: "name", label: "Customer", required: true },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email", type: "email" },
      {
        key: "customerType",
        label: "Type",
        type: "select",
        options: [
          { value: "b2c", label: "B2C Traveller" },
          { value: "b2b", label: "B2B Agent" },
          { value: "corporate", label: "Corporate Account" },
          { value: "family", label: "Family Traveller" },
          { value: "repeat", label: "Repeat Customer" },
        ],
      },
      { key: "source", label: "Source" },
      { key: "city", label: "City" },
      { key: "country", label: "Country" },
    ],
  },
  {
    id: "quotations",
    title: "Quotations",
    group: "Sales",
    endpoint: "quotations",
    description:
      "Build customer pricing with travel dates, travellers, service costs, markup, discount, and status tracking.",
    columns: [
      "Customer",
      "Destination",
      "Travel Dates",
      "Travellers",
      "Total",
      "Status",
    ],
    rowMap: [
      "customerName",
      "destination",
      "travelDates",
      "travellers",
      "sellingPrice",
      "status",
    ],
    statusOptions: ["draft", "sent", "accepted", "rejected", "expired"],
    fields: [
      { key: "customerName", label: "Customer", required: true },
      { key: "destination", label: "Destination", required: true },
      { key: "travelDates", label: "Travel Dates" },
      { key: "travellers", label: "Travellers", type: "number" },
      { key: "pricing.baseCost", label: "Base Cost", type: "number" },
      { key: "pricing.markup", label: "Markup", type: "number" },
      { key: "pricing.discount", label: "Discount", type: "number" },
    ],
  },
  {
    id: "itineraries",
    title: "Itineraries",
    group: "Sales",
    endpoint: "itineraries",
    description:
      "Create and maintain day-wise travel plans, templates, themes, and customer-ready itinerary content.",
    columns: ["Itinerary", "Destination", "Days", "Theme", "Status"],
    rowMap: ["title", "destination", "durationDays", "theme", "status"],
    statusOptions: ["draft", "ready", "shared", "archived"],
    fields: [
      { key: "title", label: "Itinerary", required: true },
      { key: "destination", label: "Destination", required: true },
      { key: "durationDays", label: "Days", type: "number" },
      { key: "theme", label: "Theme" },
    ],
  },
  {
    id: "bookings",
    title: "Bookings",
    group: "Operations",
    endpoint: "bookings",
    description:
      "Confirmed travel files with passengers, services, documents, payments, vouchers, and trip status.",
    columns: [
      "Customer",
      "Destination",
      "Travel Dates",
      "Passengers",
      "Services",
      "Status",
    ],
    rowMap: [
      "customerName",
      "destination",
      "travelDates",
      "passengers",
      "services",
      "status",
    ],
    statusOptions: [
      "draft",
      "pending_payment",
      "confirmed",
      "partially_confirmed",
      "cancelled",
      "completed",
    ],
    fields: [
      { key: "customerName", label: "Customer", required: true },
      { key: "destination", label: "Destination", required: true },
      { key: "travelDates", label: "Travel Dates" },
      { key: "quotationId", label: "Quotation ID" },
      { key: "leadId", label: "Lead ID" },
    ],
  },
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
    id: "destinations",
    title: "Destinations",
    group: "Inventory",
    endpoint: "destinations",
    description:
      "Destination master with country, region, season, highlights, and visa requirement notes.",
    columns: [
      "Destination",
      "Country",
      "Region",
      "Season",
      "Highlights",
      "Status",
    ],
    rowMap: ["name", "country", "region", "bestSeason", "highlights", "status"],
    statusOptions: ["active", "inactive"],
    fields: [
      { key: "name", label: "Destination", required: true },
      { key: "country", label: "Country", required: true },
      { key: "region", label: "Region" },
      { key: "bestSeason", label: "Best Season" },
      { key: "highlights", label: "Highlights", type: "tags" },
      { key: "visaRequirement", label: "Visa Requirement", type: "textarea" },
    ],
  },
  {
    id: "tour-packages",
    title: "Tour Packages",
    group: "Inventory",
    endpoint: "tour-packages",
    description:
      "Reusable products and packages for B2C customers, B2B agents, campaigns, and quick quotations.",
    columns: [
      "Package",
      "Destination",
      "Category",
      "Days",
      "Base Price",
      "Status",
    ],
    rowMap: [
      "title",
      "destination",
      "category",
      "durationDays",
      "basePrice",
      "status",
    ],
    statusOptions: ["draft", "active", "inactive", "archived"],
    fields: [
      { key: "title", label: "Package", required: true },
      { key: "destination", label: "Destination", required: true },
      { key: "category", label: "Category" },
      { key: "durationDays", label: "Days", type: "number" },
      { key: "basePrice", label: "Base Price", type: "number" },
      { key: "currency", label: "Currency" },
      { key: "inclusions", label: "Inclusions", type: "tags" },
    ],
  },
  {
    id: "travel-documents",
    title: "Travel Documents",
    group: "Operations",
    endpoint: "travel-documents",
    description:
      "Passport, visa, insurance, ticket, and customer document workflow for each booking.",
    columns: ["Customer", "Booking", "Document", "Number", "Expiry", "Status"],
    rowMap: [
      "customerName",
      "bookingId",
      "documentType",
      "documentNumber",
      "expiryDate",
      "status",
    ],
    statusOptions: ["pending", "received", "verified", "expired", "rejected"],
    fields: [
      { key: "customerName", label: "Customer", required: true },
      { key: "bookingId", label: "Booking ID" },
      { key: "documentType", label: "Document Type", required: true },
      { key: "documentNumber", label: "Document Number" },
      { key: "expiryDate", label: "Expiry", type: "date" },
      { key: "fileUrl", label: "File URL" },
    ],
  },
  {
    id: "vouchers",
    title: "Vouchers",
    group: "Operations",
    endpoint: "vouchers",
    description:
      "Hotel, transfer, activity, visa, guide, and customer vouchers issued from booking files.",
    columns: [
      "Booking",
      "Customer",
      "Type",
      "Supplier",
      "Confirmation",
      "Status",
    ],
    rowMap: [
      "bookingId",
      "customerName",
      "voucherType",
      "supplierName",
      "confirmationNumber",
      "status",
    ],
    statusOptions: ["draft", "issued", "sent", "cancelled"],
    fields: [
      { key: "bookingId", label: "Booking ID", required: true },
      { key: "customerName", label: "Customer", required: true },
      { key: "voucherType", label: "Voucher Type", required: true },
      { key: "supplierName", label: "Supplier" },
      { key: "issueDate", label: "Issue Date", type: "date" },
      { key: "confirmationNumber", label: "Confirmation No" },
    ],
  },
  {
    id: "support-tickets",
    title: "Support Tickets",
    group: "Support",
    endpoint: "support-tickets",
    description:
      "Customer, agent, supplier, and operations issue tracking with SLA-friendly statuses.",
    columns: [
      "Subject",
      "Customer",
      "Booking",
      "Channel",
      "Priority",
      "Status",
    ],
    rowMap: [
      "subject",
      "customerName",
      "bookingId",
      "channel",
      "priority",
      "status",
    ],
    statusOptions: [
      "open",
      "in_progress",
      "waiting_customer",
      "resolved",
      "closed",
    ],
    fields: [
      { key: "subject", label: "Subject", required: true },
      { key: "customerName", label: "Customer", required: true },
      { key: "bookingId", label: "Booking ID" },
      { key: "channel", label: "Channel" },
      {
        key: "priority",
        label: "Priority",
        type: "select",
        options: ["low", "medium", "high", "urgent"],
      },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    group: "Control",
    endpoint: "notifications",
    description:
      "Tenant and branch alerts for sales, operations, finance, support, customers, and agents.",
    columns: ["Title", "Type", "Priority", "Audience", "Module", "Status"],
    rowMap: ["title", "type", "priority", "audience", "module", "status"],
    statusOptions: ["unread", "read", "archived"],
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "message", label: "Message", type: "textarea" },
      {
        key: "type",
        label: "Type",
        type: "select",
        options: ["system", "sales", "operations", "finance", "support"],
      },
      {
        key: "priority",
        label: "Priority",
        type: "select",
        options: ["low", "medium", "high", "urgent"],
      },
      {
        key: "audience",
        label: "Audience",
        type: "select",
        options: ["tenant", "branch", "user", "agent", "customer"],
      },
      { key: "module", label: "Module" },
      { key: "recordId", label: "Record ID" },
      { key: "assignedTo", label: "Assigned To" },
    ],
  },
  {
    id: "campaigns",
    title: "Campaigns",
    group: "Growth",
    endpoint: "campaigns",
    description:
      "Marketing ROI tracking for lead source, campaign spend, quotations, bookings, revenue, and status.",
    columns: ["Campaign", "Channel", "Leads", "Quotes", "Bookings", "Revenue"],
    rowMap: ["name", "channel", "leads", "quotations", "bookings", "revenue"],
    statusOptions: ["draft", "active", "paused", "completed", "archived"],
    fields: [
      { key: "name", label: "Campaign", required: true },
      { key: "channel", label: "Channel", required: true },
      { key: "source", label: "Source" },
      { key: "spend", label: "Spend", type: "number" },
      { key: "leads", label: "Leads", type: "number" },
      { key: "quotations", label: "Quotes", type: "number" },
      { key: "bookings", label: "Bookings", type: "number" },
      { key: "revenue", label: "Revenue", type: "number" },
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
      "Tenant-scoped finance totals across receivables, payables, refunds, commissions, and total movement.",
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
  {
    id: "audit-logs",
    title: "Audit Logs",
    group: "Security",
    endpoint: "audit-logs",
    description:
      "Tenant-scoped audit trail for protected mutations and sensitive reads with export-ready payloads.",
    columns: ["Action", "Actor", "Method", "Path", "Outcome", "Status"],
    rowMap: ["action", "actorRole", "method", "path", "outcome", "statusCode"],
    fields: [],
  },
  {
    id: "team-users",
    title: "Users & Permissions",
    group: "Security",
    endpoint: "auth/users",
    description:
      "CRM users, roles, branches, status, and fine-grained permission assignment.",
    columns: ["Name", "Email", "Role", "Branch", "Status", "Permissions"],
    rowMap: ["name", "email", "role", "branchId", "status", "permissions"],
    statusOptions: ["active", "inactive", "locked", "invited"],
    fields: [],
  },
  {
    id: "permission-catalog",
    title: "Permission Catalog",
    group: "Security",
    endpoint: "auth/permissions/catalog",
    description:
      "Module/action permission map used by tenant admins and platform admins.",
    columns: ["Role", "Permissions"],
    rowMap: ["role", "permissions"],
    fields: [],
  },
  {
    id: "storage-files",
    title: "Storage Files",
    group: "System",
    endpoint: "storage/files",
    createEndpoint: "storage/files/upload-intent",
    description:
      "Registry for passports, vouchers, tickets, contracts, receipts, and generated PDFs.",
    columns: ["Entity", "File", "MIME", "Size", "Driver", "Status"],
    rowMap: [
      "entityType",
      "fileName",
      "mimeType",
      "size",
      "storageDriver",
      "status",
    ],
    fields: [
      { key: "entityType", label: "Entity Type", required: true },
      { key: "entityId", label: "Entity ID", required: true },
      { key: "fileName", label: "File Name", required: true },
      { key: "mimeType", label: "MIME Type", required: true },
      { key: "size", label: "Size", required: true, type: "number" },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    group: "System",
    endpoint: "integrations/health",
    description:
      "Local/log health status for email, WhatsApp, SMS, payments, maps, AI, monitoring, and storage.",
    columns: ["Provider", "Enabled", "Mode"],
    rowMap: ["provider", "enabled", "mode"],
    fields: [],
  },
];

const navGroups = [
  {
    title: "Overview",
    items: ["dashboard"],
  },
  {
    title: "Control",
    items: ["notifications"],
  },
  {
    title: "Sales",
    items: ["leads", "customers", "quotations", "itineraries"],
  },
  {
    title: "Operations",
    items: ["bookings", "operations", "travel-documents", "vouchers"],
  },
  { title: "Inventory", items: ["destinations", "tour-packages", "suppliers"] },
  { title: "Partners", items: ["b2b-agents"] },
  {
    title: "Finance",
    items: ["payments", "invoices", "finance-reports"],
  },
  {
    title: "Growth",
    items: ["campaigns"],
  },
  {
    title: "Support",
    items: ["support-tickets"],
  },
  {
    title: "Reports",
    items: ["sales-reports", "operations-reports", "saved-reports"],
  },
  {
    title: "Security",
    items: ["team-users", "permission-catalog", "audit-logs"],
  },
  {
    title: "System",
    items: ["storage-files", "integrations"],
  },
];

const countryPresets = {
  IN: {
    country: "India",
    currencyCode: "INR",
    currencySymbol: "INR",
    taxLabel: "GST",
    taxRate: 18,
  },
  AE: {
    country: "United Arab Emirates",
    currencyCode: "AED",
    currencySymbol: "AED",
    taxLabel: "VAT",
    taxRate: 5,
  },
  GB: {
    country: "United Kingdom",
    currencyCode: "GBP",
    currencySymbol: "GBP",
    taxLabel: "VAT",
    taxRate: 20,
  },
  EU: {
    country: "European Union",
    currencyCode: "EUR",
    currencySymbol: "EUR",
    taxLabel: "VAT",
    taxRate: 21,
  },
  US: {
    country: "United States",
    currencyCode: "USD",
    currencySymbol: "USD",
    taxLabel: "Sales Tax",
    taxRate: 0,
  },
};

type CountryCode = keyof typeof countryPresets;
type CrmTheme = "system" | "light" | "dark";

const crmThemes: { id: CrmTheme; label: string }[] = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

const themeIcons = {
  system: faDesktop,
  light: faSun,
  dark: faMoon,
};

const tenantOptions = [
  { value: "WEBNZA", label: "Webnza Travel Group" },
  { value: "TRIPOS", label: "TripOS Demo Company" },
  { value: "DMC", label: "DMC Operations" },
];
const branchOptions = [
  { value: "delhi", label: "Delhi Branch" },
  { value: "mumbai", label: "Mumbai Branch" },
  { value: "dubai", label: "Dubai Branch" },
  { value: "remote", label: "Remote Team" },
];

export default function CrmShell() {
  const router = useRouter();
  const pathname = usePathname();
  const pathModule = pathname.split("/").filter(Boolean)[0];
  const initialModule = modules.some((item) => item.id === pathModule)
    ? pathModule
    : "dashboard";
  const [selectedId, setSelectedId] = useState(initialModule);
  const [records, setRecords] = useState<ApiRecord[]>([]);
  const [dashboard, setDashboard] = useState<Record<string, unknown> | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(
    "TripOS CRM connected to production APIs.",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingModuleId, setLoadingModuleId] = useState<string | null>(null);
  const [recordModuleId, setRecordModuleId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ApiRecord | null>(null);
  const [session, setSession] = useState<CrmSession | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [theme, setTheme] = useState<CrmTheme>("system");
  const activeNavItemRef = useRef<HTMLButtonElement | null>(null);
  const selected = modules.find((item) => item.id === selectedId) ?? modules[0];

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("tripos-crm-theme");
    if (
      storedTheme === "system" ||
      storedTheme === "light" ||
      storedTheme === "dark"
    ) {
      setTheme(storedTheme);
    }
    const raw = window.localStorage.getItem("tripos-crm-session");
    if (!raw) {
      setAuthReady(true);
      return;
    }
    try {
      const stored = JSON.parse(raw) as CrmSession;
      setSession(stored);
      void fetch(`${apiBaseUrl}/auth/me`, {
        headers: sessionHeaders(stored.token, stored.user),
      })
        .then((response) =>
          response.ok
            ? response.json()
            : Promise.reject(new Error("Session expired")),
        )
        .then((nextSession) => setSession({ ...stored, ...nextSession }))
        .catch(() => {
          window.localStorage.removeItem("tripos-crm-session");
          setSession(null);
        })
        .finally(() => setAuthReady(true));
    } catch {
      window.localStorage.removeItem("tripos-crm-session");
      setAuthReady(true);
    }
  }, []);

  function changeTheme(nextTheme: CrmTheme) {
    setTheme(nextTheme);
    window.localStorage.setItem("tripos-crm-theme", nextTheme);
  }

  useEffect(() => {
    if (pathModule && modules.some((item) => item.id === pathModule))
      setSelectedId(pathModule);
  }, [pathModule]);

  useEffect(() => {
    activeNavItemRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [selectedId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (session) void loadModule(selected, query);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [selectedId, query, session]);

  async function loadModule(module: CrmModule, search = query) {
    setIsLoading(true);
    setLoadingModuleId(module.id);
    setSelectedRecord(null);
    try {
      if (module.id === "dashboard") {
        const response = await fetch(`${apiBaseUrl}/tripos/dashboard`, {
          cache: "no-store",
          headers: sessionHeaders(session?.token, session?.user),
        });
        if (!response.ok) throw new Error("Dashboard API unavailable");
        setDashboard((await response.json()) as Record<string, unknown>);
        setRecords([]);
        setRecordModuleId(null);
      } else if (module.endpoint) {
        const params = new URLSearchParams({ limit: "100" });
        if (search.trim()) params.set("search", search.trim());
        const response = await fetch(
          `${apiBaseUrl}/${module.endpoint}?${params.toString()}`,
          {
            cache: "no-store",
            headers: sessionHeaders(session?.token, session?.user),
          },
        );
        if (!response.ok) throw new Error(`${module.title} API unavailable`);
        setRecords(normalizeRecords(await response.json()));
        setRecordModuleId(module.id);
      }
      setToast(`${module.title} refreshed from TripOS API.`);
    } catch (error) {
      setRecords([]);
      setRecordModuleId(module.id);
      setToast(error instanceof Error ? error.message : "API unavailable.");
    } finally {
      setIsLoading(false);
      setLoadingModuleId(null);
    }
  }

  function selectModule(id: string) {
    setSelectedId(id);
    router.push(id === "dashboard" ? "/" : `/${id}`);
  }

  async function createRecord(values: Record<string, string>) {
    if (!selected.endpoint) return;
    const response = await fetch(
      `${apiBaseUrl}/${selected.createEndpoint ?? selected.endpoint}`,
      {
        body: JSON.stringify(toPayload(selected.fields, values)),
        headers: {
          "Content-Type": "application/json",
          ...sessionHeaders(session?.token, session?.user),
        },
        method: "POST",
      },
    );
    if (!response.ok) throw new Error(`Could not create ${selected.title}`);
    setModalOpen(false);
    await loadModule(selected);
  }

  async function updateStatus(record: ApiRecord, status: string) {
    const id = getRecordId(record);
    if (!id || !selected.endpoint) return;
    const path = selected.stageEndpoint
      ? `${selected.endpoint}/${id}/stage`
      : `${selected.endpoint}/${id}/status`;
    const body = selected.stageEndpoint ? { stage: status } : { status };
    const response = await fetch(`${apiBaseUrl}/${path}`, {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...sessionHeaders(session?.token, session?.user),
      },
      method: "PATCH",
    });
    if (!response.ok) {
      setToast(`Could not update ${selected.title} status.`);
      return;
    }
    await loadModule(selected);
  }

  async function importRecords(file: File) {
    if (!selected.endpoint) return;
    try {
      const text = await file.text();
      const importedRecords = file.name.toLowerCase().endsWith(".json")
        ? (JSON.parse(text) as Record<string, unknown>[])
        : csvToRecords(text, selected.columns, selected.rowMap);
      if (!Array.isArray(importedRecords) || !importedRecords.length)
        throw new Error("No importable records found.");
      for (const record of importedRecords) {
        const response = await fetch(
          `${apiBaseUrl}/${selected.createEndpoint ?? selected.endpoint}`,
          {
            body: JSON.stringify(record),
            headers: {
              "Content-Type": "application/json",
              ...sessionHeaders(session?.token, session?.user),
            },
            method: "POST",
          },
        );
        if (!response.ok)
          throw new Error(`Import failed for ${selected.title}`);
      }
      setToast(`${importedRecords.length} ${selected.title} records imported.`);
      await loadModule(selected);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Import failed.");
    }
  }

  async function logout() {
    if (session?.token) {
      await fetch(`${apiBaseUrl}/auth/logout`, {
        headers: sessionHeaders(session.token, session.user),
        method: "POST",
      }).catch(() => undefined);
    }
    window.localStorage.removeItem("tripos-crm-session");
    setSession(null);
    setRecords([]);
    setToast("Logged out.");
  }

  const rows = useMemo(
    () =>
      recordModuleId === selected.id
        ? records.map((record) => ({
            record,
            row: recordToRow(record, selected),
          }))
        : [],
    [recordModuleId, records, selected],
  );
  const filteredRows = rows.filter(({ row }) =>
    row.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  const metrics = buildMetrics(records, dashboard);
  const isModuleLoading = isLoading && loadingModuleId === selected.id;
  const notificationCount = buildNotificationCount(dashboard, records);

  function updateWorkspace(field: "tenantCode" | "branchId", value: string) {
    if (!session) return;
    const nextSession: CrmSession = {
      ...session,
      tenant:
        field === "tenantCode"
          ? { ...session.tenant, code: value }
          : session.tenant,
      user: { ...session.user, [field]: value },
    };
    setSession(nextSession);
    window.localStorage.setItem(
      "tripos-crm-session",
      JSON.stringify(nextSession),
    );
    setToast("Workspace context updated.");
    window.setTimeout(() => void loadModule(selected, query), 0);
  }

  if (!authReady)
    return (
      <div className={`auth-screen theme-${theme}`}>
        <section className="auth-card">
          <h1>TripOS</h1>
          <p>Loading secure workspace...</p>
        </section>
      </div>
    );
  if (!session)
    return (
      <LoginScreen
        theme={theme}
        onLogin={(nextSession) => {
          window.localStorage.setItem(
            "tripos-crm-session",
            JSON.stringify(nextSession),
          );
          setSession(nextSession);
          setToast("Logged in.");
        }}
      />
    );

  return (
    <div className={`admin-shell theme-${theme}`}>
      <aside className="sidebar">
        <div className="sidebar-head">
          <button
            className="brand"
            onClick={() => selectModule("dashboard")}
            type="button"
          >
            <span className="brand-mark">T</span>
            <span>
              <strong>TripOS</strong>
              <small>Travel Operating System</small>
            </span>
          </button>
          <span className="sidebar-status">Live CRM</span>
        </div>
        <nav className="main-menu" aria-label="TripOS modules">
          {navGroups.map((group) => (
            <section className="nav-group" key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map((id) => {
                const module = modules.find((item) => item.id === id);
                if (!module) return null;
                return (
                  <button
                    className={selectedId === id ? "selected" : ""}
                    key={id}
                    onClick={() => selectModule(id)}
                    ref={selectedId === id ? activeNavItemRef : undefined}
                    type="button"
                  >
                    <span>{module.title}</span>
                  </button>
                );
              })}
            </section>
          ))}
        </nav>
      </aside>

      <section className="right-sec">
        <header className="topbar">
          <div className="topbar-title">
            <strong>TripOS Admin CRM</strong>
            <small>{String(session.tenant.name ?? "Tenant Workspace")}</small>
          </div>
          <div className="top-actions">
            <div className="header-workspace" aria-label="Workspace context">
              <label>
                <FontAwesomeIcon aria-hidden icon={faBuilding} />
                <select
                  aria-label="Tenant"
                  onChange={(event) =>
                    updateWorkspace("tenantCode", event.target.value)
                  }
                  value={String(
                    session.tenant.code ?? session.user.tenantCode ?? "WEBNZA",
                  )}
                >
                  {tenantOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <FontAwesomeIcon aria-hidden icon={faCodeBranch} />
                <select
                  aria-label="Branch"
                  onChange={(event) =>
                    updateWorkspace("branchId", event.target.value)
                  }
                  value={String(session.user.branchId ?? "delhi")}
                >
                  {branchOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <ThemeSwitcher onChange={changeTheme} selectedTheme={theme} />
            <div className="profile-chip">
              <span>{String(session.user.name ?? "Admin").slice(0, 1)}</span>
              <div>
                <strong>{String(session.user.name ?? "TripOS Admin")}</strong>
                <small>
                  {formatDisplayValue(
                    String(session.user.role ?? "tenant_admin"),
                  )}
                </small>
              </div>
            </div>
            <button
              aria-label={`${notificationCount} notifications`}
              className="icon-action notification-action"
              onClick={() => selectModule("notifications")}
              title="Notifications"
              type="button"
            >
              <FontAwesomeIcon aria-hidden icon={faBell} />
              {notificationCount ? <span>{notificationCount}</span> : null}
            </button>
            <button
              className="logout-action"
              onClick={() => void logout()}
              type="button"
            >
              <FontAwesomeIcon aria-hidden icon={faRightFromBracket} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="workspace">
          <nav className="workspace-breadcrumb" aria-label="Current location">
            <span>TripOS Admin CRM</span>
            <span>{selected.group}</span>
            <strong>{selected.title}</strong>
          </nav>

          <section className="hero-panel">
            <div>
              <span className="eyebrow">{selected.group}</span>
              <h2>
                {selected.id === "dashboard" ? "Live Control" : "Workspace"}
              </h2>
              <p>{selected.description}</p>
            </div>
            <strong aria-busy={isLoading}>API Ready</strong>
          </section>

          <section className="kpi-grid" aria-label="TripOS metrics">
            {metrics.map(([label, value, helper]) => (
              <article className="metric-card" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <p>{helper}</p>
              </article>
            ))}
          </section>

          {selected.id === "invoices" ? (
            <InvoiceBuilder onSaved={() => void loadModule(selected)} />
          ) : null}
          {selected.id === "dashboard" ? (
            <DashboardPanel dashboard={dashboard} />
          ) : (
            <RecordTable
              columns={selected.columns}
              filteredRows={filteredRows}
              isLoading={isModuleLoading}
              module={selected}
              onCreate={() => setModalOpen(true)}
              onExport={(format) =>
                exportRecords(
                  selected.title,
                  selected.columns,
                  filteredRows,
                  format,
                )
              }
              onImport={(file) => void importRecords(file)}
              onRefresh={() => void loadModule(selected, query)}
              onSelect={setSelectedRecord}
              onStatus={updateStatus}
              query={query}
              setQuery={setQuery}
            />
          )}

          <section className="quick-grid">
            <article>
              <span className="eyebrow">Production Data</span>
              <strong>Direct module APIs</strong>
              <p>
                CRM records now load from dedicated TripOS endpoints instead of
                generic demo records.
              </p>
            </article>
            <article>
              <span className="eyebrow">B2B + Operations</span>
              <strong>Inside admin CRM</strong>
              <p>
                Agents, supplier ops, vouchers, payments, documents, and tickets
                stay in one back-office workspace.
              </p>
            </article>
            <article>
              <span className="eyebrow">Next Sync</span>
              <strong>Mobile customer flows</strong>
              <p>
                The same APIs can power B2C trip status, vouchers, documents,
                support, and payments in the app.
              </p>
            </article>
          </section>

          {selectedRecord ? (
            <DetailPanel
              module={selected}
              record={selectedRecord}
              onClose={() => setSelectedRecord(null)}
            />
          ) : null}
          {modalOpen ? (
            <RecordForm
              module={selected}
              onClose={() => setModalOpen(false)}
              onSubmit={createRecord}
            />
          ) : null}
          <div className="toast" role="status">
            {toast}
          </div>
        </main>
      </section>
    </div>
  );
}

function ThemeSwitcher({
  onChange,
  selectedTheme,
}: {
  onChange: (theme: CrmTheme) => void;
  selectedTheme: CrmTheme;
}) {
  return (
    <fieldset className="theme-switcher">
      <legend>Theme</legend>
      <div className="theme-radio-group">
        {crmThemes.map((item) => (
          <label
            className={selectedTheme === item.id ? "selected" : ""}
            key={item.id}
            title={`${item.label} theme`}
          >
            <input
              checked={selectedTheme === item.id}
              onChange={() => onChange(item.id)}
              type="radio"
            />
            <FontAwesomeIcon aria-hidden icon={themeIcons[item.id]} />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RecordTable({
  columns,
  filteredRows,
  isLoading,
  module,
  onCreate,
  onExport,
  onImport,
  onRefresh,
  onSelect,
  onStatus,
  query,
  setQuery,
}: {
  columns: string[];
  filteredRows: { record: ApiRecord; row: string[] }[];
  isLoading: boolean;
  module: CrmModule;
  onCreate: () => void;
  onExport: (format: "csv" | "json") => void;
  onImport: (file: File) => void;
  onRefresh: () => void;
  onSelect: (record: ApiRecord) => void;
  onStatus: (record: ApiRecord, status: string) => Promise<void>;
  query: string;
  setQuery: (query: string) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState(0);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows([]);
  }, [module.id, query, pageSize]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((left, right) => {
      const leftValue = left.row[sortColumn] ?? "";
      const rightValue = right.row[sortColumn] ?? "";
      const numericLeft = Number(leftValue.replace(/[^0-9.-]/g, ""));
      const numericRight = Number(rightValue.replace(/[^0-9.-]/g, ""));
      const comparison =
        Number.isFinite(numericLeft) &&
        Number.isFinite(numericRight) &&
        leftValue.match(/\d/) &&
        rightValue.match(/\d/)
          ? numericLeft - numericRight
          : leftValue.localeCompare(rightValue, undefined, {
              numeric: true,
              sensitivity: "base",
            });
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredRows, sortColumn, sortDirection]);
  const total = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageRows = sortedRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );
  const pageRowIds = pageRows.map(
    ({ record, row }) => getRecordId(record) || row.join("-"),
  );
  const allPageSelected =
    pageRowIds.length > 0 &&
    pageRowIds.every((id) => selectedRows.includes(id));
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  )
    .filter(
      (page) =>
        Math.abs(page - safePage) <= 2 || page === 1 || page === totalPages,
    )
    .slice(0, 7);

  function updateSort(index: number) {
    if (sortColumn === index) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }
    setSortColumn(index);
    setSortDirection("asc");
    setCurrentPage(1);
  }

  function toggleRow(id: string) {
    setSelectedRows((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function togglePageRows() {
    setSelectedRows((current) =>
      allPageSelected
        ? current.filter((id) => !pageRowIds.includes(id))
        : Array.from(new Set([...current, ...pageRowIds])),
    );
  }

  return (
    <section className="table-card listmanager">
      <div className="table-head">
        <div>
          <span className="eyebrow">{module.title}</span>
          <h2>Live Work Queue</h2>
        </div>
        <div className="table-tools">
          <label className="table-search">
            <FontAwesomeIcon aria-hidden icon={faSearch} />
            <input
              aria-label={`Search ${module.title}`}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${module.title.toLowerCase()}`}
              value={query}
            />
          </label>
          <label className="download-select">
            <FontAwesomeIcon aria-hidden icon={faDownload} />
            <select
              aria-label={`Download ${module.title}`}
              defaultValue=""
              onChange={(event) => {
                const value = event.target.value as "csv" | "json" | "";
                if (value) onExport(value);
                event.currentTarget.value = "";
              }}
            >
              <option value="" disabled>
                Download
              </option>
              <option value="csv">CSV File</option>
              <option value="json">JSON File</option>
            </select>
          </label>
          <button
            className="table-tool-button"
            disabled={isLoading}
            onClick={onRefresh}
            type="button"
          >
            <FontAwesomeIcon aria-hidden icon={faArrowRotateRight} />
            <span>Refresh</span>
          </button>
          {module.fields.length ? (
            <button
              className="table-tool-button primary"
              onClick={onCreate}
              type="button"
            >
              <FontAwesomeIcon aria-hidden icon={faPlus} />
              <span>Create</span>
            </button>
          ) : null}
          {module.fields.length ? (
            <label className="table-tool-button import-button">
              <FontAwesomeIcon aria-hidden icon={faFileImport} />
              <span>Import</span>
              <input
                accept=".csv,.json"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onImport(file);
                  event.currentTarget.value = "";
                }}
                type="file"
              />
            </label>
          ) : null}
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="select-col">
                <input
                  aria-label="Select page rows"
                  checked={allPageSelected}
                  onChange={togglePageRows}
                  type="checkbox"
                />
              </th>
              <th className="serial-col">S.No.</th>
              {columns.map((column, index) => (
                <th key={column}>
                  <button
                    className="sort-header"
                    onClick={() => updateSort(index)}
                    type="button"
                  >
                    <span>{column}</span>
                    <FontAwesomeIcon
                      aria-hidden
                      icon={
                        sortColumn === index
                          ? sortDirection === "asc"
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                    />
                  </button>
                </th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && pageRows.length === 0 ? (
              <tr>
                <td className="empty-row" colSpan={columns.length + 3}>
                  Loading {module.title.toLowerCase()}...
                </td>
              </tr>
            ) : null}
            {pageRows.map(({ record, row }, rowIndex) => {
              const rowId = getRecordId(record) || row.join("-");
              return (
                <tr key={rowId} onClick={() => onSelect(record)}>
                  <td
                    className="select-col"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <input
                      aria-label={`Select row ${(safePage - 1) * pageSize + rowIndex + 1}`}
                      checked={selectedRows.includes(rowId)}
                      onChange={() => toggleRow(rowId)}
                      type="checkbox"
                    />
                  </td>
                  <td className="serial-col">
                    {(safePage - 1) * pageSize + rowIndex + 1}
                  </td>
                  {row.map((cell, index) => (
                    <td key={`${cell}-${index}`}>{renderCell(cell)}</td>
                  ))}
                  <td onClick={(event) => event.stopPropagation()}>
                    {module.statusOptions ? (
                      <select
                        value={String(record.stage ?? record.status ?? "")}
                        onChange={(event) =>
                          void onStatus(record, event.target.value)
                        }
                      >
                        {module.statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {optionLabel(status, "status")}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button type="button" onClick={() => onSelect(record)}>
                        <FontAwesomeIcon aria-hidden icon={faFolderOpen} />
                        <span>Open</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!isLoading && !total ? (
              <tr>
                <td className="empty-row" colSpan={columns.length + 3}>
                  No API records found for this module.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="pagination-bar">
        <div className="pagination-actions" aria-label="Listing pagination">
          <button
            aria-label="First page"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage(1)}
            type="button"
            title="First page"
          >
            <FontAwesomeIcon aria-hidden icon={faAnglesLeft} />
          </button>
          <button
            aria-label="Previous page"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
            type="button"
            title="Previous page"
          >
            <FontAwesomeIcon aria-hidden icon={faChevronLeft} />
          </button>
          {pageNumbers.map((page) => (
            <button
              aria-current={page === safePage ? "page" : undefined}
              className={page === safePage ? "selected" : ""}
              key={page}
              onClick={() => setCurrentPage(page)}
              type="button"
            >
              {page}
            </button>
          ))}
          <button
            aria-label="Next page"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
            type="button"
            title="Next page"
          >
            <FontAwesomeIcon aria-hidden icon={faChevronRight} />
          </button>
          <button
            aria-label="Last page"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage(totalPages)}
            type="button"
            title="Last page"
          >
            <FontAwesomeIcon aria-hidden icon={faAnglesRight} />
          </button>
          <label className="page-size-control">
            <select
              aria-label="Rows per page"
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setCurrentPage(1);
              }}
              value={pageSize}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
        <span className="pagination-total">
          Page {safePage} of {totalPages} / {total} records
        </span>
      </div>
    </section>
  );
}

function LoginScreen({
  onLogin,
  theme,
}: {
  onLogin: (session: CrmSession) => void;
  theme: CrmTheme;
}) {
  const [email, setEmail] = useState("admin@tripos.test");
  const [password, setPassword] = useState("TripOS@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        body: JSON.stringify({
          email,
          password,
          tenantCode: "WEBNZA",
          branchId: "delhi",
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) throw new Error("Invalid login or API unavailable");
      onLogin((await response.json()) as CrmSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`auth-screen theme-${theme}`}>
      <section className="auth-card">
        <div className="auth-card-head">
          <span className="brand-mark">T</span>
          <strong>Secure Workspace</strong>
        </div>
        <h1>TripOS Admin CRM</h1>
        <p>
          Secure travel operations workspace for CRM, sales, finance, suppliers,
          and branch teams.
        </p>
        <label>
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? <div className="form-error">{error}</div> : null}
        <button disabled={loading} onClick={() => void login()} type="button">
          {loading ? "Signing in" : "Login"}
        </button>
      </section>
    </div>
  );
}

function DashboardPanel({
  dashboard,
}: {
  dashboard: Record<string, unknown> | null;
}) {
  const modulesPayload = dashboard?.modules;
  const items = Array.isArray(modulesPayload)
    ? (modulesPayload.slice(0, 8) as Record<string, unknown>[])
    : [];
  return (
    <section className="table-card">
      <div className="table-head">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h2>Backend Module Readiness</h2>
        </div>
        <strong>{items.length || "Live"}</strong>
      </div>
      <div className="module-grid">
        {modules
          .filter((item) => item.id !== "dashboard")
          .map((item) => (
            <article key={item.id}>
              <strong>{item.title}</strong>
              <span>{item.endpoint ? `/${item.endpoint}` : "workspace"}</span>
              <p>{item.description}</p>
            </article>
          ))}
      </div>
    </section>
  );
}

function exportRecords(
  title: string,
  columns: string[],
  rows: { record: ApiRecord; row: string[] }[],
  format: "csv" | "json",
) {
  const safeName = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (format === "json") {
    downloadBlob(
      `${safeName}.json`,
      JSON.stringify(
        rows.map(({ record }) => record),
        null,
        2,
      ),
      "application/json",
    );
    return;
  }
  const csv = [
    columns.map(csvEscape).join(","),
    ...rows.map(({ row }) => row.map(csvEscape).join(",")),
  ].join("\n");
  downloadBlob(`${safeName}.csv`, csv, "text/csv");
}

function csvToRecords(csv: string, columns: string[], rowMap: string[]) {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const [, ...body] = lines;
  return body.map((line) => {
    const values = parseCsvLine(line);
    return values.reduce<Record<string, unknown>>((record, value, index) => {
      const key = rowMap[index] ?? columns[index];
      if (!key) return record;
      setNestedValue(record, key, value);
      return record;
    }, {});
  });
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;
  for (const char of line) {
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === "," && !quoted) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values;
}

function setNestedValue(
  target: Record<string, unknown>,
  path: string,
  value: unknown,
) {
  const parts = path.split(".");
  let cursor = target;
  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      cursor[part] = value;
      return;
    }
    const next = cursor[part];
    if (!next || typeof next !== "object") cursor[part] = {};
    cursor = cursor[part] as Record<string, unknown>;
  });
}

function csvEscape(value: string) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function downloadBlob(fileName: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function DetailPanel({
  module,
  onClose,
  record,
}: {
  module: CrmModule;
  onClose: () => void;
  record: ApiRecord;
}) {
  return (
    <aside className="detail-panel">
      <button onClick={onClose} type="button">
        Close
      </button>
      <span className="eyebrow">{module.title}</span>
      <h2>
        {String(
          record[module.rowMap[0]] ??
            record.title ??
            record.name ??
            getRecordId(record),
        )}
      </h2>
      {module.rowMap.map((path, index) => (
        <div className="detail-row" key={path}>
          <span>{module.columns[index]}</span>
          <strong>
            {formatDisplayValue(
              String(
                path
                  .split(".")
                  .reduce<unknown>(
                    (value, key) =>
                      value && typeof value === "object"
                        ? (value as Record<string, unknown>)[key]
                        : undefined,
                    record,
                  ) ?? "-",
              ),
              path,
            )}
          </strong>
        </div>
      ))}
    </aside>
  );
}

function RecordForm({
  module,
  onClose,
  onSubmit,
}: {
  module: CrmModule;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => Promise<void>;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      module.fields.map((field) => [
        field.key,
        field.options?.[0] ? optionValue(field.options[0]) : "",
      ]),
    ),
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit() {
    setSaving(true);
    setError("");
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="modal-backdrop-layer" role="presentation">
      <section className="record-modal" role="dialog" aria-modal="true">
        <div className="record-modal-head">
          <div>
            <span className="eyebrow">{module.group}</span>
            <h3>Create {module.title}</h3>
          </div>
          <button onClick={onClose} type="button">
            Close
          </button>
        </div>
        <div className="record-form-grid">
          {module.fields.map((field) => (
            <FormField
              field={field}
              key={field.key}
              onChange={(value) =>
                setValues((current) => ({ ...current, [field.key]: value }))
              }
              value={values[field.key] ?? ""}
            />
          ))}
        </div>
        {error ? <div className="form-error">{error}</div> : null}
        <div className="record-modal-actions">
          <button onClick={onClose} type="button">
            Cancel
          </button>
          <button
            disabled={
              saving ||
              module.fields.some(
                (field) => field.required && !values[field.key]?.trim(),
              )
            }
            onClick={() => void submit()}
            type="button"
          >
            {saving ? "Saving" : "Save"}
          </button>
        </div>
      </section>
    </div>
  );
}

function FormField({
  field,
  onChange,
  value,
}: {
  field: ModuleField;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className={field.type === "textarea" ? "formrow wide" : "formrow"}>
      <span>
        {field.label}
        {field.required ? " *" : ""}
      </span>
      {field.type === "select" ? (
        <select
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          {field.options?.map((option) => (
            <option key={optionValue(option)} value={optionValue(option)}>
              {optionLabel(option, field.key)}
            </option>
          ))}
        </select>
      ) : null}
      {field.type === "textarea" ? (
        <textarea
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          value={value}
        />
      ) : null}
      {!field.type ||
      ["text", "number", "email", "date", "tags"].includes(field.type) ? (
        <input
          onChange={(event) => onChange(event.target.value)}
          placeholder={
            field.placeholder ??
            (field.type === "tags" ? "Comma separated" : "")
          }
          type={field.type === "tags" ? "text" : (field.type ?? "text")}
          value={value}
        />
      ) : null}
    </label>
  );
}

function InvoiceBuilder({ onSaved }: { onSaved: () => void }) {
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [series, setSeries] = useState("TRV-");
  const [invoiceNo, setInvoiceNo] = useState("0001");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [providerName, setProviderName] = useState("Webnza Travels");
  const [providerTaxNo, setProviderTaxNo] = useState("GSTIN-TRIPOS-DEMO");
  const [customerName, setCustomerName] = useState("Sharma Family");
  const [entries, setEntries] = useState([
    {
      dateProvided: invoiceDate,
      description: "Dubai travel package",
      qty: 1,
      qtyType: "package",
      rate: 100000,
      total: 100000,
    },
  ]);
  const [status, setStatus] = useState("Ready.");
  const preset = countryPresets[countryCode];
  const subtotal = entries.reduce(
    (sum, entry) => sum + Number(entry.total || 0),
    0,
  );
  const taxAmount = subtotal * (preset.taxRate / 100);
  const totalPayable = subtotal + taxAmount;
  const invoiceFileName = `${series}${invoiceNo}`.replace(/[^a-z0-9-]/gi, "-");
  const invoiceHtml = buildInvoiceDocument({
    country: preset.country,
    currencySymbol: preset.currencySymbol,
    customerName,
    entries,
    invoiceDate,
    invoiceNo,
    providerName,
    providerTaxNo,
    series,
    subtotal,
    taxAmount,
    taxLabel: preset.taxLabel,
    taxRate: preset.taxRate,
    totalPayable,
  });
  function updateEntry(
    index: number,
    field: keyof (typeof entries)[number],
    value: string,
  ) {
    setEntries((current) =>
      current.map((entry, entryIndex) => {
        if (entryIndex !== index) return entry;
        const next = {
          ...entry,
          [field]: ["description", "qtyType", "dateProvided"].includes(field)
            ? value
            : Number(value),
        };
        if (field === "qty" || field === "rate")
          next.total = Number(next.qty || 0) * Number(next.rate || 0);
        return next;
      }),
    );
  }
  async function generateNumber() {
    const response = await fetch(
      `${apiBaseUrl}/finance/invoices/next-number/${encodeURIComponent(series)}`,
    );
    const result = (await response.json()) as { invoiceNo?: string };
    setInvoiceNo(result.invoiceNo ?? "0001");
  }
  async function saveInvoice() {
    const response = await fetch(`${apiBaseUrl}/finance/invoices`, {
      body: JSON.stringify({
        invoiceSeries: series,
        invoiceNo,
        invoiceDate,
        countryCode,
        currencyCode: preset.currencyCode,
        currencySymbol: preset.currencySymbol,
        taxLabel: preset.taxLabel,
        taxRate: preset.taxRate,
        provider: { companyName: providerName, taxNo: providerTaxNo },
        customer: { companyName: customerName },
        entries,
        status: "draft",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    setStatus(response.ok ? "Invoice saved." : "Invoice save failed.");
    if (response.ok) onSaved();
  }
  function downloadInvoice(format: "pdf" | "doc" | "xls") {
    if (format === "pdf") {
      const printWindow = window.open("", "_blank", "width=920,height=720");
      if (!printWindow) {
        setStatus("Allow popups to export PDF.");
        return;
      }
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      setStatus("PDF export opened.");
      return;
    }
    downloadBlob(
      format === "doc" ? `${invoiceFileName}.doc` : `${invoiceFileName}.xls`,
      invoiceHtml,
      format === "doc" ? "application/msword" : "application/vnd.ms-excel",
    );
    setStatus(`${format.toUpperCase()} downloaded.`);
  }
  return (
    <section className="invoice-builder">
      <div className="invoice-form-panel">
        <div className="table-head">
          <div>
            <span className="eyebrow">Invoice Utility</span>
            <h2>Country-aware travel invoice</h2>
          </div>
          <button onClick={generateNumber} type="button">
            Generate Number
          </button>
        </div>
        <div className="invoice-form-grid">
          <label>
            Country
            <select
              value={countryCode}
              onChange={(event) =>
                setCountryCode(event.target.value as CountryCode)
              }
            >
              {Object.entries(countryPresets).map(([code, item]) => (
                <option key={code} value={code}>
                  {item.country}
                </option>
              ))}
            </select>
          </label>
          <label>
            Series
            <input
              value={series}
              onChange={(event) => setSeries(event.target.value)}
            />
          </label>
          <label>
            Invoice No
            <input
              value={invoiceNo}
              onChange={(event) => setInvoiceNo(event.target.value)}
            />
          </label>
          <label>
            Date
            <input
              type="date"
              value={invoiceDate}
              onChange={(event) => setInvoiceDate(event.target.value)}
            />
          </label>
          <label>
            Provider
            <input
              value={providerName}
              onChange={(event) => setProviderName(event.target.value)}
            />
          </label>
          <label>
            Provider Tax No
            <input
              value={providerTaxNo}
              onChange={(event) => setProviderTaxNo(event.target.value)}
            />
          </label>
          <label>
            Customer
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
            />
          </label>
        </div>
        <div className="table-wrap invoice-lines">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="date"
                      value={entry.dateProvided}
                      onChange={(event) =>
                        updateEntry(index, "dateProvided", event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={entry.description}
                      onChange={(event) =>
                        updateEntry(index, "description", event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={entry.qty}
                      onChange={(event) =>
                        updateEntry(index, "qty", event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={entry.qtyType}
                      onChange={(event) =>
                        updateEntry(index, "qtyType", event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={entry.rate}
                      onChange={(event) =>
                        updateEntry(index, "rate", event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={entry.total}
                      onChange={(event) =>
                        updateEntry(index, "total", event.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="action-bar">
          <button
            onClick={() =>
              setEntries([
                ...entries,
                {
                  dateProvided: invoiceDate,
                  description: "Additional service",
                  qty: 1,
                  qtyType: "unit",
                  rate: 0,
                  total: 0,
                },
              ])
            }
            type="button"
          >
            Add Line
          </button>
          <button onClick={saveInvoice} type="button">
            Save Invoice
          </button>
          <button onClick={() => downloadInvoice("pdf")} type="button">
            <FontAwesomeIcon aria-hidden icon={faFilePdf} />
            PDF
          </button>
          <button onClick={() => downloadInvoice("doc")} type="button">
            <FontAwesomeIcon aria-hidden icon={faFileWord} />
            DOC
          </button>
          <button onClick={() => downloadInvoice("xls")} type="button">
            <FontAwesomeIcon aria-hidden icon={faFileExcel} />
            Excel
          </button>
          <span>{status}</span>
        </div>
      </div>
      <aside className="invoice-preview">
        <div className="invoice-preview-head">
          <span className="eyebrow">{preset.country}</span>
          <strong>Draft Invoice</strong>
        </div>
        <h2>
          {series}
          {invoiceNo}
        </h2>
        <p>
          {providerName} to {customerName}
        </p>
        <div className="invoice-summary-list">
          {entries.map((entry, index) => (
            <div key={`${entry.description}-${index}`}>
              <span>{entry.description}</span>
              <strong>
                {preset.currencySymbol} {Number(entry.total || 0).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>
              {preset.currencySymbol} {subtotal.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt>
              {preset.taxLabel} {preset.taxRate}%
            </dt>
            <dd>
              {preset.currencySymbol} {taxAmount.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>
              {preset.currencySymbol} {totalPayable.toFixed(2)}
            </dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}

function buildInvoiceDocument({
  country,
  currencySymbol,
  customerName,
  entries,
  invoiceDate,
  invoiceNo,
  providerName,
  providerTaxNo,
  series,
  subtotal,
  taxAmount,
  taxLabel,
  taxRate,
  totalPayable,
}: {
  country: string;
  currencySymbol: string;
  customerName: string;
  entries: {
    dateProvided: string;
    description: string;
    qty: number;
    qtyType: string;
    rate: number;
    total: number;
  }[];
  invoiceDate: string;
  invoiceNo: string;
  providerName: string;
  providerTaxNo: string;
  series: string;
  subtotal: number;
  taxAmount: number;
  taxLabel: string;
  taxRate: number;
  totalPayable: number;
}) {
  const rows = entries
    .map(
      (entry) => `
        <tr>
          <td>${entry.dateProvided}</td>
          <td>${entry.description}</td>
          <td>${entry.qty}</td>
          <td>${entry.qtyType}</td>
          <td>${currencySymbol} ${Number(entry.rate || 0).toFixed(2)}</td>
          <td>${currencySymbol} ${Number(entry.total || 0).toFixed(2)}</td>
        </tr>`,
    )
    .join("");
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${series}${invoiceNo}</title>
    <style>
      body { color: #132321; font-family: Arial, sans-serif; margin: 32px; }
      header { border-bottom: 2px solid #0f766e; display: flex; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; }
      h1 { color: #0f766e; margin: 0; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #bdcfca; padding: 10px; text-align: left; }
      th { background: #e9f4f1; }
      .totals { margin-left: auto; margin-top: 18px; width: 320px; }
      .totals div { display: flex; justify-content: space-between; padding: 8px 0; }
      .grand { border-top: 2px solid #0f766e; color: #0f766e; font-size: 18px; font-weight: 700; }
    </style>
  </head>
  <body>
    <header>
      <div>
        <h1>${series}${invoiceNo}</h1>
        <p>${country} / ${invoiceDate}</p>
      </div>
      <div>
        <strong>${providerName}</strong>
        <p>${providerTaxNo}</p>
      </div>
    </header>
    <p><strong>Bill To:</strong> ${customerName}</p>
    <table>
      <thead>
        <tr><th>Date</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Total</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <section class="totals">
      <div><span>Subtotal</span><strong>${currencySymbol} ${subtotal.toFixed(2)}</strong></div>
      <div><span>${taxLabel} ${taxRate}%</span><strong>${currencySymbol} ${taxAmount.toFixed(2)}</strong></div>
      <div class="grand"><span>Total</span><strong>${currencySymbol} ${totalPayable.toFixed(2)}</strong></div>
    </section>
  </body>
</html>`;
}

function buildMetrics(
  records: ApiRecord[],
  dashboard: Record<string, unknown> | null,
): [string, string, string][] {
  if (Array.isArray(dashboard?.metrics)) {
    return dashboard.metrics.map((metric) => {
      const item = metric as Record<string, unknown>;
      return [
        String(item.label ?? "Metric"),
        String(item.value ?? "0"),
        String(item.helper ?? "Live"),
      ];
    });
  }

  const dashboardTotal =
    typeof dashboard?.totalRecords === "number"
      ? String(dashboard.totalRecords)
      : "Live";
  return [
    ["Records", String(records.length || dashboardTotal), "Current module"],
    ["API", "Dedicated", "No generic records"],
    ["Tenant", "Demo Org", "Branch scoped"],
    ["Status", "Ready", "Mongo-backed"],
  ];
}

function buildNotificationCount(
  dashboard: Record<string, unknown> | null,
  records: ApiRecord[],
) {
  const explicitCount = dashboard?.notificationsCount ?? dashboard?.alertsCount;
  if (typeof explicitCount === "number") return explicitCount;

  return records.filter((record) => {
    const status = String(
      record.status ?? record.stage ?? record.priority ?? "",
    ).toLowerCase();
    return [
      "urgent",
      "overdue",
      "pending",
      "blocked",
      "failed",
      "due",
      "high",
    ].some((signal) => status.includes(signal));
  }).length;
}

function renderCell(value: string) {
  const klass = statusClass(value);
  return klass === "neutral" ? (
    value
  ) : (
    <span className={`badge ${klass}`}>{value}</span>
  );
}
