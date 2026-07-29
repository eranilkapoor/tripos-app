export type FieldType =
  "text" | "number" | "email" | "date" | "select" | "textarea" | "tags";

export type SelectOption = string | { value: string; label: string };

export type ModuleField = {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: SelectOption[];
  placeholder?: string;
};

export type CrmModule = {
  id: string;
  title: string;
  group: string;
  endpoint?: string;
  createEndpoint?: string;
  metricKey?: string;
  description: string;
  columns: string[];
  rowMap: string[];
  fields: ModuleField[];
  statusOptions?: string[];
  stageEndpoint?: boolean;
};

export type ApiRecord = Record<string, unknown> & {
  _id?: string;
  id?: string;
  status?: string;
  stage?: string;
};

export type CrmSession = {
  token: string;
  user: Record<string, unknown>;
  tenant: Record<string, unknown>;
};
