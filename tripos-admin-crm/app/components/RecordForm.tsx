"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CrmModule } from "./crmTypes";
import { optionValue, valueAtRawPath } from "./crmUtils";
import {
  buildZodSchemaFromFields,
  fieldFormKey,
} from "../validation/dynamicSchema";
import FormField from "./FormField";

export default function RecordForm({
  module,
  onClose,
  initialRecord,
  onSubmit,
}: {
  module: CrmModule;
  onClose: () => void;
  initialRecord?: Record<string, unknown> | null;
  onSubmit: (values: Record<string, string>) => Promise<void>;
}) {
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, string>>({
    defaultValues: Object.fromEntries(
      module.fields.map((field) => [
        fieldFormKey(field.key),
        initialRecord
          ? formValue(valueAtRawPath(initialRecord, field.key))
          : field.options?.[0]
            ? optionValue(field.options[0])
            : "",
      ]),
    ),
    resolver: zodResolver(buildZodSchemaFromFields(module.fields)),
  });

  async function submit(formValues: Record<string, string>) {
    setFormError("");
    const values = Object.fromEntries(
      module.fields.map((field) => [
        field.key,
        formValues[fieldFormKey(field.key)] ?? "",
      ]),
    );
    try {
      await onSubmit(values);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <div className="modal-backdrop-layer" role="presentation">
      <section className="record-modal" role="dialog" aria-modal="true">
        <div className="record-modal-head">
          <div>
            <span className="eyebrow">{module.group}</span>
            <h3>
              {initialRecord ? "Update" : "Create"} {module.title}
            </h3>
          </div>
          <button onClick={onClose} type="button">
            Close
          </button>
        </div>
        <div className="record-form-grid">
          {module.fields.map((field) => (
            <FormField
              error={
                errors[fieldFormKey(field.key)]?.message as string | undefined
              }
              field={field}
              key={field.key}
              name={fieldFormKey(field.key)}
              register={register}
            />
          ))}
        </div>
        {formError ? <div className="form-error">{formError}</div> : null}
        <div className="record-modal-actions">
          <button onClick={onClose} type="button">
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            onClick={() => void handleSubmit(submit)()}
            type="button"
          >
            {isSubmitting ? "Saving" : "Save"}
          </button>
        </div>
      </section>
    </div>
  );
}

function formValue(value: unknown) {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}
