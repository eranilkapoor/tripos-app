import { z, type ZodTypeAny } from "zod";
import type { ModuleField } from "../components/crmTypes";

export function fieldFormKey(key: string) {
  return key.replace(/\./g, "__");
}

function fieldSchema(field: ModuleField): ZodTypeAny {
  const type = field.type ?? "text";
  if (type === "email")
    return field.required
      ? z
          .string()
          .trim()
          .min(1, `${field.label} is required.`)
          .email(`${field.label} must be a valid email.`)
      : z
          .string()
          .trim()
          .email(`${field.label} must be a valid email.`)
          .optional()
          .or(z.literal(""));
  if (type === "number")
    return field.required
      ? z
          .string()
          .trim()
          .min(1, `${field.label} is required.`)
          .refine(
            (value) => !Number.isNaN(Number(value)),
            `${field.label} must be a number.`,
          )
      : z
          .string()
          .refine(
            (value) => !value || !Number.isNaN(Number(value)),
            `${field.label} must be a number.`,
          )
          .optional()
          .or(z.literal(""));
  return field.required
    ? z.string().trim().min(1, `${field.label} is required.`)
    : z.string().optional().or(z.literal(""));
}

export function buildZodSchemaFromFields(fields: ModuleField[]) {
  const shape: Record<string, ZodTypeAny> = {};
  for (const field of fields) shape[fieldFormKey(field.key)] = fieldSchema(field);
  return z.object(shape);
}
