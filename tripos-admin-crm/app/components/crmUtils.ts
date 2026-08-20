import type {
  ApiRecord,
  CrmModule,
  ModuleField,
  ModuleRow,
  SelectOption,
} from "./crmTypes";

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
  const value = valueAtRawPath(record, path);
  if (Array.isArray(value)) return value.length ? `${value.length} items` : "-";
  if (typeof value === "number") return formatNumber(value);
  if (value === undefined || value === null || value === "") return "-";
  return formatDisplayValue(String(value), path);
}

export function valueAtRawPath(record: Record<string, unknown>, path: string) {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, record);
}

export function recordToRow(record: ApiRecord, module: CrmModule) {
  return module.rowMap.map((path) => valueAtPath(record, path));
}

export function formatDisplayValue(value: string, path = "") {
  if (!value || value === "-") return "-";
  const normalizedPath = path.toLowerCase();
  const semanticLabelPaths = [
    "status",
    "stage",
    "type",
    "customertype",
    "priority",
    "audience",
    "role",
  ];
  const labelOverrides: Record<string, string> = {
    b2b: "B2B",
    b2c: "B2C",
    organization_admin: "Organization Admin",
    kyc: "KYC",
    api: "API",
    dmc: "DMC",
    crm: "CRM",
  };
  const normalizedValue = value.toLowerCase();
  if (labelOverrides[normalizedValue]) return labelOverrides[normalizedValue];
  const isTechnicalId =
    normalizedPath.endsWith("id") ||
    normalizedPath.includes(".id") ||
    normalizedPath === "_id";
  if (/^[a-f0-9]{24}$/i.test(value))
    return `Ref ${value.slice(-6).toUpperCase()}`;
  if (isTechnicalId && /^[a-z0-9_-]{8,}$/i.test(value))
    return `Ref ${value.slice(-8).replace(/[_-]/g, " ").toUpperCase()}`;
  if (
    /[_-]/.test(value) ||
    semanticLabelPaths.some((item) => normalizedPath.endsWith(item))
  )
    return titleize(value);
  return value;
}

export function titleize(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bB2b\b/g, "B2B")
    .replace(/\bB2c\b/g, "B2C")
    .replace(/\bKyc\b/g, "KYC")
    .replace(/\bApi\b/g, "API")
    .replace(/\bDmc\b/g, "DMC")
    .replace(/\bCrm\b/g, "CRM");
}

export function optionValue(option: SelectOption) {
  return typeof option === "string" ? option : option.value;
}

export function optionLabel(option: SelectOption, path = "") {
  return typeof option === "string"
    ? formatDisplayValue(option, path)
    : option.label;
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
          : field.type === "textarea"
            ? parseTextareaValue(raw ?? "")
            : (raw ?? "");
    assignPath(payload, field.key, value);
  }
  return payload;
}

function parseTextareaValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed) as unknown;
    } catch {
      return value;
    }
  }
  return value;
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

export function csvToRecords(csv: string, columns: string[], rowMap: string[]) {
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

export function csvEscape(value: string) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function downloadBlob(fileName: string, content: string, type: string) {
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

export function exportRecords(
  title: string,
  columns: string[],
  rows: ModuleRow[],
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

export function buildMetrics(
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
    ["Organization", "Demo Org", "Branch scoped"],
    ["Status", "Ready", "Mongo-backed"],
  ];
}

export function buildNotificationCount(
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
