import type { ApiRecord, CrmModule, ModuleField } from "./crmTypes";

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export function getRecordId(record: ApiRecord) {
  return String(record._id ?? record.id ?? "");
}

export function normalizeRecords(payload: unknown): ApiRecord[] {
  if (Array.isArray(payload)) return payload as ApiRecord[];
  if (!payload || typeof payload !== "object") return [];
  const source = payload as {
    data?: unknown;
    items?: unknown;
    records?: unknown;
  };
  if (Array.isArray(source.data)) return source.data as ApiRecord[];
  if (Array.isArray(source.items)) return source.items as ApiRecord[];
  if (Array.isArray(source.records)) return source.records as ApiRecord[];
  if (
    "totals" in source &&
    source.totals &&
    typeof source.totals === "object"
  ) {
    return Object.entries(source.totals as Record<string, unknown>).map(
      ([key, value]) => ({ metric: key, value }),
    );
  }
  if (
    "roleDefaults" in source &&
    source.roleDefaults &&
    typeof source.roleDefaults === "object"
  ) {
    return Object.entries(source.roleDefaults as Record<string, unknown>).map(
      ([role, permissions]) => ({ role, permissions }),
    );
  }
  return Object.entries(source).map(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value))
      return { key, ...(value as Record<string, unknown>) };
    return { key, value };
  });
}

export function valueAtPath(record: ApiRecord, path: string) {
  const value = path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, record);
  if (Array.isArray(value)) return value.length ? `${value.length} items` : "-";
  if (typeof value === "number") return formatNumber(value);
  if (value === undefined || value === null || value === "") return "-";
  return formatDisplayValue(String(value), path);
}

export function recordToRow(record: ApiRecord, module: CrmModule) {
  return module.rowMap.map((path) => valueAtPath(record, path));
}

export function formatDisplayValue(value: string, path = "") {
  if (!value || value === "-") return "-";
  const normalizedPath = path.toLowerCase();
  const isTechnicalId =
    normalizedPath.endsWith("id") ||
    normalizedPath.includes(".id") ||
    normalizedPath === "_id";
  if (/^[a-f0-9]{24}$/i.test(value))
    return `Ref ${value.slice(-6).toUpperCase()}`;
  if (isTechnicalId && /^[a-z0-9_-]{8,}$/i.test(value))
    return `Ref ${value.slice(-8).replace(/[_-]/g, " ").toUpperCase()}`;
  if (/[_-]/.test(value)) return titleize(value);
  return value;
}

export function titleize(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    value,
  );
}

export function toPayload(
  fields: ModuleField[],
  values: Record<string, string>,
) {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = values[field.key]?.trim();
    if (!raw && !field.required) continue;
    const value: unknown =
      field.type === "number"
        ? Number(raw || 0)
        : field.type === "tags"
          ? raw
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : (raw ?? "");
    assignPath(payload, field.key, value);
  }
  return payload;
}

function assignPath(
  target: Record<string, unknown>,
  path: string,
  value: unknown,
) {
  const parts = path.split(".");
  let cursor = target;
  for (const part of parts.slice(0, -1)) {
    if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
    cursor = cursor[part] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]] = value;
}

export function statusClass(value: string) {
  const normalized = value.toLowerCase().replace(/\s+/g, "_");
  if (
    [
      "active",
      "confirmed",
      "completed",
      "paid",
      "verified",
      "issued",
      "sent",
      "won",
    ].includes(normalized)
  )
    return "good";
  if (
    [
      "draft",
      "pending",
      "open",
      "new",
      "assigned",
      "contacted",
      "in_progress",
      "requirement_collected",
    ].includes(normalized)
  )
    return "warn";
  if (
    ["cancelled", "lost", "blocked", "rejected", "expired", "urgent"].includes(
      normalized,
    )
  )
    return "danger";
  return "neutral";
}

export function sessionHeaders(token?: string, user?: Record<string, unknown>) {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (user?.tenantId) headers["x-tenant-id"] = String(user.tenantId);
  if (user?.branchId) headers["x-branch-id"] = String(user.branchId);
  return headers;
}
