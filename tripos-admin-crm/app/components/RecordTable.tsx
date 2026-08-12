"use client";

import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faArrowRotateRight,
  faChevronLeft,
  faChevronRight,
  faDownload,
  faFileImport,
  faFolderOpen,
  faPlus,
  faSearch,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import type { ApiRecord, CrmModule, ModuleRow } from "./crmTypes";
import { getRecordId, optionLabel, statusClass } from "./crmUtils";

export default function RecordTable({
  columns,
  filteredRows,
  isLoading,
  module,
  onCreate,
  onExport,
  onImport,
  onRefresh,
  onSelect,
  onStatus,
  query,
  setQuery,
}: {
  columns: string[];
  filteredRows: ModuleRow[];
  isLoading: boolean;
  module: CrmModule;
  onCreate: () => void;
  onExport: (format: "csv" | "json") => void;
  onImport: (file: File) => void;
  onRefresh: () => void;
  onSelect: (record: ApiRecord) => void;
  onStatus: (record: ApiRecord, status: string) => Promise<void>;
  query: string;
  setQuery: (query: string) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState(0);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows([]);
  }, [module.id, query, pageSize]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((left, right) => {
      const leftValue = left.row[sortColumn] ?? "";
      const rightValue = right.row[sortColumn] ?? "";
      const numericLeft = Number(leftValue.replace(/[^0-9.-]/g, ""));
      const numericRight = Number(rightValue.replace(/[^0-9.-]/g, ""));
      const comparison =
        Number.isFinite(numericLeft) &&
        Number.isFinite(numericRight) &&
        leftValue.match(/\d/) &&
        rightValue.match(/\d/)
          ? numericLeft - numericRight
          : leftValue.localeCompare(rightValue, undefined, {
              numeric: true,
              sensitivity: "base",
            });
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredRows, sortColumn, sortDirection]);
  const total = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageRows = sortedRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );
  const pageRowIds = pageRows.map(
    ({ record, row }, index) =>
      getRecordId(record) ||
      `${module.id}-${safePage}-${index}-${row.join("-")}`,
  );
  const allPageSelected =
    pageRowIds.length > 0 &&
    pageRowIds.every((id) => selectedRows.includes(id));
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  )
    .filter(
      (page) =>
        Math.abs(page - safePage) <= 2 || page === 1 || page === totalPages,
    )
    .slice(0, 7);

  function updateSort(index: number) {
    if (sortColumn === index) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }
    setSortColumn(index);
    setSortDirection("asc");
    setCurrentPage(1);
  }

  function toggleRow(id: string) {
    setSelectedRows((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function togglePageRows() {
    setSelectedRows((current) =>
      allPageSelected
        ? current.filter((id) => !pageRowIds.includes(id))
        : Array.from(new Set([...current, ...pageRowIds])),
    );
  }

  return (
    <section className="table-card listmanager">
      <div className="table-head">
        <div>
          <span className="eyebrow">{module.title}</span>
          <h2>Live Work Queue</h2>
        </div>
        <div className="table-tools">
          <label className="table-search">
            <FontAwesomeIcon aria-hidden icon={faSearch} />
            <input
              aria-label={`Search ${module.title}`}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${module.title.toLowerCase()}`}
              value={query}
            />
          </label>
          <label className="download-select">
            <FontAwesomeIcon aria-hidden icon={faDownload} />
            <select
              aria-label={`Download ${module.title}`}
              defaultValue=""
              onChange={(event) => {
                const value = event.target.value as "csv" | "json" | "";
                if (value) onExport(value);
                event.currentTarget.value = "";
              }}
            >
              <option value="" disabled>
                Download
              </option>
              <option value="csv">CSV File</option>
              <option value="json">JSON File</option>
            </select>
          </label>
          <button
            className="table-tool-button"
            disabled={isLoading}
            onClick={onRefresh}
            type="button"
          >
            <FontAwesomeIcon aria-hidden icon={faArrowRotateRight} />
            <span>Refresh</span>
          </button>
          {module.fields.length ? (
            <button
              className="table-tool-button primary"
              onClick={onCreate}
              type="button"
            >
              <FontAwesomeIcon aria-hidden icon={faPlus} />
              <span>Create</span>
            </button>
          ) : null}
          {module.fields.length ? (
            <label className="table-tool-button import-button">
              <FontAwesomeIcon aria-hidden icon={faFileImport} />
              <span>Import</span>
              <input
                accept=".csv,.json"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onImport(file);
                  event.currentTarget.value = "";
                }}
                type="file"
              />
            </label>
          ) : null}
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="select-col">
                <input
                  aria-label="Select page rows"
                  checked={allPageSelected}
                  onChange={togglePageRows}
                  type="checkbox"
                />
              </th>
              <th className="serial-col">S.No.</th>
              {columns.map((column, index) => (
                <th key={column}>
                  <button
                    className="sort-header"
                    onClick={() => updateSort(index)}
                    type="button"
                  >
                    <span>{column}</span>
                    <FontAwesomeIcon
                      aria-hidden
                      icon={
                        sortColumn === index
                          ? sortDirection === "asc"
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                    />
                  </button>
                </th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && pageRows.length === 0 ? (
              <tr>
                <td className="empty-row" colSpan={columns.length + 3}>
                  Loading {module.title.toLowerCase()}...
                </td>
              </tr>
            ) : null}
            {pageRows.map(({ record, row }, rowIndex) => {
              const rowId =
                getRecordId(record) ||
                `${module.id}-${safePage}-${rowIndex}-${row.join("-")}`;
              return (
                <tr key={rowId} onClick={() => onSelect(record)}>
                  <td
                    className="select-col"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <input
                      aria-label={`Select row ${(safePage - 1) * pageSize + rowIndex + 1}`}
                      checked={selectedRows.includes(rowId)}
                      onChange={() => toggleRow(rowId)}
                      type="checkbox"
                    />
                  </td>
                  <td className="serial-col">
                    {(safePage - 1) * pageSize + rowIndex + 1}
                  </td>
                  {row.map((cell, index) => (
                    <td key={`${cell}-${index}`}>{renderCell(cell)}</td>
                  ))}
                  <td onClick={(event) => event.stopPropagation()}>
                    {module.statusOptions ? (
                      <select
                        value={String(record.stage ?? record.status ?? "")}
                        onChange={(event) =>
                          void onStatus(record, event.target.value)
                        }
                      >
                        {module.statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {optionLabel(status, "status")}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button type="button" onClick={() => onSelect(record)}>
                        <FontAwesomeIcon aria-hidden icon={faFolderOpen} />
                        <span>Open</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!isLoading && !total ? (
              <tr>
                <td className="empty-row" colSpan={columns.length + 3}>
                  No API records found for this module.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="pagination-bar">
        <div className="pagination-actions" aria-label="Listing pagination">
          <button
            aria-label="First page"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage(1)}
            type="button"
            title="First page"
          >
            <FontAwesomeIcon aria-hidden icon={faAnglesLeft} />
          </button>
          <button
            aria-label="Previous page"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
            type="button"
            title="Previous page"
          >
            <FontAwesomeIcon aria-hidden icon={faChevronLeft} />
          </button>
          {pageNumbers.map((page) => (
            <button
              aria-current={page === safePage ? "page" : undefined}
              className={page === safePage ? "selected" : ""}
              key={page}
              onClick={() => setCurrentPage(page)}
              type="button"
            >
              {page}
            </button>
          ))}
          <button
            aria-label="Next page"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
            type="button"
            title="Next page"
          >
            <FontAwesomeIcon aria-hidden icon={faChevronRight} />
          </button>
          <button
            aria-label="Last page"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage(totalPages)}
            type="button"
            title="Last page"
          >
            <FontAwesomeIcon aria-hidden icon={faAnglesRight} />
          </button>
          <label className="page-size-control">
            <select
              aria-label="Rows per page"
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setCurrentPage(1);
              }}
              value={pageSize}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
        <span className="pagination-total">
          Page {safePage} of {totalPages} / {total} records
        </span>
      </div>
    </section>
  );
}

function renderCell(value: string) {
  const klass = statusClass(value);
  return klass === "neutral" ? (
    value
  ) : (
    <span className={`badge ${klass}`}>{value}</span>
  );
}
