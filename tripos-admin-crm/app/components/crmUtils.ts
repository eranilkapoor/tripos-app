import type { ApiRecord, CrmModule, ModuleField } from "./crmTypes";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export function getRecordId(record: ApiRecord) {
  return String(record._id ?? record.id ?? "");
}

export function normalizeRecords(payload: unknown): ApiRecord[] {
  if (Array.isArray(payload)) return payload as ApiRecord[];
  if (!payload || typeof payload !== "object") return [];
  const source = payload as { data?: unknown; items?: unknown; records?: unknown };
  if (Array.isArray(source.data)) return source.data as ApiRecord[];
  if (Array.isArray(source.items)) return source.items as ApiRecord[];
  if (Array.isArray(source.records)) return source.records as ApiRecord[];
  return [];
}

export function valueAtPath(record: ApiRecord, path: string) {
  const value = path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, record);
  if (Array.isArray(value)) return value.length ? `${value.length} items` : "-";
  if (typeof value === "number") return formatNumber(value);
  if (value === undefined || value === null || value === "") return "-";
  return String(value);
}

export function recordToRow(record: ApiRecord, module: CrmModule) {
  return module.rowMap.map((path) => valueAtPath(record, path));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

export function toPayload(fields: ModuleField[], values: Record<string, string>) {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = values[field.key]?.trim();
    if (!raw && !field.required) continue;
    const value: unknown =
      field.type === "number"
        ? Number(raw || 0)
        : field.type === "tags"
          ? raw.split(",").map((item) => item.trim()).filter(Boolean)
          : raw ?? "";
    assignPath(payload, field.key, value);
  }
  return payload;
}

function assignPath(target: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".");
  let cursor = target;
  for (const part of parts.slice(0, -1)) {
    if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
    cursor = cursor[part] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]] = value;
}

export function statusClass(value: string) {
  const normalized = value.toLowerCase();
  if (["active", "confirmed", "completed", "paid", "verified", "issued", "sent", "won"].includes(normalized)) return "good";
  if (["draft", "pending", "open", "new", "assigned", "contacted", "in_progress", "requirement_collected"].includes(normalized)) return "warn";
  if (["cancelled", "lost", "blocked", "rejected", "expired", "urgent"].includes(normalized)) return "danger";
  return "neutral";
}
