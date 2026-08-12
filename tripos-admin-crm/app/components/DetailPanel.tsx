"use client";

import type { ApiRecord, CrmModule } from "./crmTypes";
import { formatDisplayValue, getRecordId } from "./crmUtils";

export default function DetailPanel({
  module,
  onClose,
  record,
}: {
  module: CrmModule;
  onClose: () => void;
  record: ApiRecord;
}) {
  return (
    <aside className="detail-panel">
      <button onClick={onClose} type="button">
        Close
      </button>
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
