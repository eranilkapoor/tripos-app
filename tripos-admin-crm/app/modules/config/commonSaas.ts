import type { CrmModule } from "../../components/crmTypes";

const commonFields = [
  { key: "title", label: "Title", required: true },
  { key: "code", label: "Code" },
  { key: "category", label: "Category" },
  { key: "entityType", label: "Entity Type" },
  { key: "entityId", label: "Entity Ref" },
  { key: "ownerId", label: "Owner User Ref" },
  { key: "assignedTo", label: "Assigned To" },
  { key: "channel", label: "Channel" },
  {
    key: "priority",
    label: "Priority",
    type: "select" as const,
    options: ["low", "medium", "high", "urgent"],
  },
  { key: "dueAt", label: "Due At", type: "date" as const },
  { key: "scheduledAt", label: "Scheduled At", type: "date" as const },
  { key: "completedAt", label: "Completed At", type: "date" as const },
  { key: "description", label: "Description", type: "textarea" as const },
  { key: "details", label: "Details", type: "textarea" as const },
  { key: "tags", label: "Tags", type: "tags" as const },
  { key: "metadata", label: "Internal Metadata", type: "textarea" as const },
];

function operatingModule(
  id: string,
  title: string,
  group: string,
  description: string,
): CrmModule {
  return {
    id,
    title,
    group,
    endpoint: `operating-records/${id}`,
    description,
    columns: ["Title", "Category", "Entity", "Owner", "Due", "Status"],
    rowMap: ["title", "category", "entityId", "ownerId", "dueAt", "status"],
    statusOptions: ["active", "open", "in_progress", "completed", "cancelled"],
    fields: commonFields,
  };
}

const commonSaasModules: CrmModule[] = [
  operatingModule(
    "contacts",
    "Contacts",
    "Sales",
    "Reusable contact records for travellers, corporate buyers, suppliers, agents, and emergency contacts.",
  ),
  operatingModule(
    "activities",
    "Activities",
    "Sales",
    "Unified CRM activity timeline for calls, WhatsApp, emails, notes, stage changes, and workflow actions.",
  ),
  operatingModule(
    "follow-ups",
    "Follow-ups",
    "Sales",
    "Follow-up queues for leads, quotations, customers, agents, bookings, payments, and support cases.",
  ),
  operatingModule(
    "meetings",
    "Meetings",
    "Operations",
    "Trip planning calls, supplier meetings, corporate reviews, customer briefings, and calendar-ready schedules.",
  ),
  operatingModule(
    "notes",
    "Notes",
    "Operations",
    "Internal notes attached to leads, customers, bookings, suppliers, payments, and support workflows.",
  ),
  operatingModule(
    "service-catalog",
    "Service Catalog",
    "Inventory",
    "Sellable and operational travel services such as hotels, transfers, visas, guides, activities, and add-ons.",
  ),
  operatingModule(
    "custom-fields",
    "Custom Fields",
    "System",
    "Organization-defined fields for travel workflows, branch-specific data capture, and customer-managed metadata.",
  ),
  operatingModule(
    "call-center",
    "Call Center",
    "Support",
    "Inbound and outbound call queues, dispositions, callbacks, recording references, and agent ownership.",
  ),
  operatingModule(
    "field-force",
    "Field Force",
    "Operations",
    "Field visits, supplier inspections, airport reps, guide check-ins, route notes, and geo-ready operations.",
  ),
  operatingModule(
    "content",
    "Content",
    "Marketing",
    "Public website and campaign content entries for destinations, packages, FAQs, testimonials, and SEO blocks.",
  ),
  operatingModule(
    "analytics",
    "Analytics",
    "Reports",
    "Reusable analytics definitions for sales funnel, booking conversion, operations SLA, finance, and campaign ROI.",
  ),
];

export default commonSaasModules;
