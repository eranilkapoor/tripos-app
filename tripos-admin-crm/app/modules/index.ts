import type { CrmModule } from "../components/crmTypes";
import crmSalesModules from "./config/crmSales";
import operationsModules from "./config/operations";
import financeModules from "./config/finance";
import marketingModules from "./config/marketing";
import identityModules from "./config/identity";
import platformModules from "./config/platform";

const ORIGINAL_ORDER = [
  "dashboard",
  "my-profile",
  "change-password",
  "subscription-plans",
  "pricing-plans",
  "subscriptions",
  "leads",
  "customers",
  "quotations",
  "itineraries",
  "bookings",
  "operations",
  "suppliers",
  "b2b-agents",
  "payments",
  "destinations",
  "tour-packages",
  "travel-documents",
  "vouchers",
  "support-tickets",
  "notifications",
  "tasks",
  "tags",
  "campaigns",
  "invoices",
  "finance-reports",
  "sales-reports",
  "operations-reports",
  "saved-reports",
  "organizations",
  "audit-logs",
  "branches",
  "departments",
  "teams",
  "roles",
  "permissions",
  "user-roles",
  "role-permissions",
  "invitations",
  "team-users",
  "permission-catalog",
  "storage-files",
  "integrations",
  "batch-jobs",
  "settings",
];

const byId = new Map<string, CrmModule>(
  [
    ...platformModules,
    ...crmSalesModules,
    ...operationsModules,
    ...financeModules,
    ...marketingModules,
    ...identityModules,
  ].map((module) => [module.id, module]),
);

export const modules: CrmModule[] = ORIGINAL_ORDER.map((id) => {
  const moduleConfig = byId.get(id);
  if (!moduleConfig) throw new Error(`Missing module config for "${id}"`);
  return moduleConfig;
});

export const navGroups = modules.reduce<{ title: string; items: string[] }[]>(
  (groups, module) => {
    const existing = groups.find((group) => group.title === module.group);
    if (existing) existing.items.push(module.id);
    else groups.push({ title: module.group, items: [module.id] });
    return groups;
  },
  [],
);
