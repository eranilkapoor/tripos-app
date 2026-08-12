"use client";

import type { UseFormRegister } from "react-hook-form";
import type { ModuleField } from "./crmTypes";
import { optionLabel, optionValue } from "./crmUtils";

export default function FormField({
  error,
  field,
  name,
  register,
}: {
  error?: string;
  field: ModuleField;
  name: string;
  register: UseFormRegister<Record<string, string>>;
}) {
  return (
    <label className={field.type === "textarea" ? "formrow wide" : "formrow"}>
      <span>
        {field.label}
        {field.required ? " *" : ""}
      </span>
      {field.type === "select" ? (
        <select {...register(name)}>
          {field.options?.map((option) => (
            <option key={optionValue(option)} value={optionValue(option)}>
              {optionLabel(option, field.key)}
            </option>
          ))}
        </select>
      ) : null}
      {field.type === "textarea" ? (
        <textarea placeholder={field.placeholder} {...register(name)} />
      ) : null}
      {!field.type ||
      ["text", "number", "email", "date", "tags"].includes(field.type) ? (
        <input
          placeholder={
            field.placeholder ??
            (field.type === "tags" ? "Comma separated" : "")
          }
          type={field.type === "tags" ? "text" : (field.type ?? "text")}
          {...register(name)}
        />
      ) : null}
      {error ? <span className="form-error">{error}</span> : null}
    </label>
  );
}
