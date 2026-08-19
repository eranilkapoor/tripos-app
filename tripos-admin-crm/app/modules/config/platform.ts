import type { CrmModule } from "../../components/crmTypes";

const platformModules: CrmModule[] = [
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
    id: "audit-logs",
    title: "Audit Logs",
    group: "Security",
    endpoint: "audit-logs",
    description:
      "Organization-scoped audit trail for protected mutations and sensitive reads with export-ready payloads.",
    columns: ["Action", "Actor", "Method", "Path", "Outcome", "Status"],
    rowMap: ["action", "actorRole", "method", "path", "outcome", "statusCode"],
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
  {
    id: "settings",
    title: "Settings",
    group: "System",
    endpoint: "settings",
    description:
      "Organization and branch runtime settings for branding, defaults, workflow controls, and integrations.",
    columns: ["Key", "Label", "Category", "Status"],
    rowMap: ["key", "label", "category", "status"],
    statusOptions: ["active", "inactive"],
    fields: [
      { key: "key", label: "Key", required: true },
      { key: "label", label: "Label", required: true },
      { key: "category", label: "Category" },
      { key: "value", label: "Value", type: "textarea" },
    ],
  },
  {
    id: "batch-jobs",
    title: "Batch Jobs",
    group: "System",
    endpoint: "batch-jobs",
    description:
      "Scheduled platform jobs for notification retention, operations SLA checks, and manual sandbox runs.",
    columns: ["Job", "Interval", "Last Status", "Last Run", "Result"],
    rowMap: [
      "name",
      "intervalMinutes",
      "lastStatus",
      "lastRunAt",
      "lastResult",
    ],
    fields: [],
  },
];

export default platformModules;
