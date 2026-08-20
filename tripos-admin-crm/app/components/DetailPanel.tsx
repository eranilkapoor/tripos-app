"use client";

import type { ApiRecord, CrmModule } from "./crmTypes";
import { formatDisplayValue, getRecordId } from "./crmUtils";

export default function DetailPanel({
  module,
  onClose,
  onEdit,
  record,
}: {
  module: CrmModule;
  onClose: () => void;
  onEdit?: () => void;
  record: ApiRecord;
}) {
  return (
    <aside className="detail-panel">
      <div className="detail-actions">
        {onEdit && module.fields.length ? (
          <button onClick={onEdit} type="button">
            Edit
          </button>
        ) : null}
        <button onClick={onClose} type="button">
          Close
        </button>
      </div>
      <span className="eyebrow">{module.title}</span>
      <h2>
        {String(
          record[module.rowMap[0]] ??
            record.title ??
            record.name ??
            getRecordId(record),
        )}
      </h2>
      {module.rowMap.map((path, index) => (
        <div className="detail-row" key={path}>
          <span>{module.columns[index]}</span>
          <strong>
            {formatDisplayValue(
              String(
                path
                  .split(".")
                  .reduce<unknown>(
                    (value, key) =>
                      value && typeof value === "object"
                        ? (value as Record<string, unknown>)[key]
                        : undefined,
                    record,
                  ) ?? "-",
              ),
              path,
            )}
          </strong>
        </div>
      ))}
    </aside>
  );
}
