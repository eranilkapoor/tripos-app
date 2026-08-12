"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faFilePdf,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";
import { downloadBlob } from "./crmUtils";
import { apiGet, apiPost } from "../lib/apiClient";
import { invoiceSchema, type InvoiceFormValues } from "../validation/invoiceSchema";

const countryPresets = {
  IN: {
    country: "India",
    currencyCode: "INR",
    currencySymbol: "INR",
    taxLabel: "GST",
    taxRate: 18,
  },
  AE: {
    country: "United Arab Emirates",
    currencyCode: "AED",
    currencySymbol: "AED",
    taxLabel: "VAT",
    taxRate: 5,
  },
  GB: {
    country: "United Kingdom",
    currencyCode: "GBP",
    currencySymbol: "GBP",
    taxLabel: "VAT",
    taxRate: 20,
  },
  EU: {
    country: "European Union",
    currencyCode: "EUR",
    currencySymbol: "EUR",
    taxLabel: "VAT",
    taxRate: 21,
  },
  US: {
    country: "United States",
    currencyCode: "USD",
    currencySymbol: "USD",
    taxLabel: "Sales Tax",
    taxRate: 0,
  },
};

type CountryCode = keyof typeof countryPresets;

export default function InvoiceBuilder({ onSaved }: { onSaved: () => void }) {
  const [status, setStatus] = useState("Ready.");
  const invoiceDate = new Date().toISOString().slice(0, 10);
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<InvoiceFormValues>({
    defaultValues: {
      countryCode: "IN",
      series: "TRV-",
      invoiceNo: "0001",
      invoiceDate,
      provider: { companyName: "Webnza Travels", taxNo: "GSTIN-TRIPOS-DEMO" },
      customer: { companyName: "Sharma Family" },
      entries: [
        {
          dateProvided: invoiceDate,
          description: "Dubai travel package",
          qty: 1,
          qtyType: "package",
          rate: 100000,
          total: 100000,
        },
      ],
    },
    resolver: zodResolver(invoiceSchema),
  });
  const { fields: entryFields, append } = useFieldArray({
    control,
    name: "entries",
  });

  const values = watch();
  const preset = countryPresets[values.countryCode as CountryCode];
  const subtotal = values.entries.reduce(
    (sum, entry) => sum + Number(entry.total || 0),
    0,
  );
  const taxAmount = subtotal * (preset.taxRate / 100);
  const totalPayable = subtotal + taxAmount;
  const invoiceFileName = `${values.series}${values.invoiceNo}`.replace(
    /[^a-z0-9-]/gi,
    "-",
  );
  const invoiceHtml = buildInvoiceDocument({
    country: preset.country,
    currencySymbol: preset.currencySymbol,
    customerName: values.customer.companyName,
    entries: values.entries,
    invoiceDate: values.invoiceDate,
    invoiceNo: values.invoiceNo,
    providerName: values.provider.companyName,
    providerTaxNo: values.provider.taxNo,
    series: values.series,
    subtotal,
    taxAmount,
    taxLabel: preset.taxLabel,
    taxRate: preset.taxRate,
    totalPayable,
  });

  function recomputeTotal(index: number) {
    const qty = Number(getValues(`entries.${index}.qty`) || 0);
    const rate = Number(getValues(`entries.${index}.rate`) || 0);
    setValue(`entries.${index}.total`, qty * rate);
  }

  async function generateNumber() {
    const result = await apiGet<{ invoiceNo?: string }>(
      `finance/invoices/next-number/${encodeURIComponent(values.series)}`,
    );
    setValue("invoiceNo", result.invoiceNo ?? "0001");
  }

  async function saveInvoice(data: InvoiceFormValues) {
    try {
      await apiPost(
        "finance/invoices",
        {
          invoiceSeries: data.series,
          invoiceNo: data.invoiceNo,
          invoiceDate: data.invoiceDate,
          countryCode: data.countryCode,
          currencyCode: preset.currencyCode,
          currencySymbol: preset.currencySymbol,
          taxLabel: preset.taxLabel,
          taxRate: preset.taxRate,
          provider: data.provider,
          customer: data.customer,
          entries: data.entries,
          status: "draft",
        },
        { errorMessage: "Invoice save failed." },
      );
      setStatus("Invoice saved.");
      onSaved();
    } catch {
      setStatus("Invoice save failed.");
    }
  }

  function downloadInvoice(format: "pdf" | "doc" | "xls") {
    if (format === "pdf") {
      const printWindow = window.open("", "_blank", "width=920,height=720");
      if (!printWindow) {
        setStatus("Allow popups to export PDF.");
        return;
      }
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      setStatus("PDF export opened.");
      return;
    }
    downloadBlob(
      format === "doc" ? `${invoiceFileName}.doc` : `${invoiceFileName}.xls`,
      invoiceHtml,
      format === "doc" ? "application/msword" : "application/vnd.ms-excel",
    );
    setStatus(`${format.toUpperCase()} downloaded.`);
  }

  return (
    <section className="invoice-builder">
      <div className="invoice-form-panel">
        <div className="table-head">
          <div>
            <span className="eyebrow">Invoice Utility</span>
            <h2>Country-aware travel invoice</h2>
          </div>
          <button onClick={() => void generateNumber()} type="button">
            Generate Number
          </button>
        </div>
        <div className="invoice-form-grid">
          <label>
            Country
            <select {...register("countryCode")}>
              {Object.entries(countryPresets).map(([code, item]) => (
                <option key={code} value={code}>
                  {item.country}
                </option>
              ))}
            </select>
          </label>
          <label>
            Series
            <input {...register("series")} />
            {errors.series ? (
              <span className="form-error">{errors.series.message}</span>
            ) : null}
          </label>
          <label>
            Invoice No
            <input {...register("invoiceNo")} />
            {errors.invoiceNo ? (
              <span className="form-error">{errors.invoiceNo.message}</span>
            ) : null}
          </label>
          <label>
            Date
            <input type="date" {...register("invoiceDate")} />
            {errors.invoiceDate ? (
              <span className="form-error">{errors.invoiceDate.message}</span>
            ) : null}
          </label>
          <label>
            Provider
            <input {...register("provider.companyName")} />
            {errors.provider?.companyName ? (
              <span className="form-error">
                {errors.provider.companyName.message}
              </span>
            ) : null}
          </label>
          <label>
            Provider Tax No
            <input {...register("provider.taxNo")} />
            {errors.provider?.taxNo ? (
              <span className="form-error">{errors.provider.taxNo.message}</span>
            ) : null}
          </label>
          <label>
            Customer
            <input {...register("customer.companyName")} />
            {errors.customer?.companyName ? (
              <span className="form-error">
                {errors.customer.companyName.message}
              </span>
            ) : null}
          </label>
        </div>
        <div className="table-wrap invoice-lines">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {entryFields.map((entry, index) => (
                <tr key={entry.id}>
                  <td>
                    <input
                      type="date"
                      {...register(`entries.${index}.dateProvided`)}
                    />
                  </td>
                  <td>
                    <input {...register(`entries.${index}.description`)} />
                  </td>
                  <td>
                    <input
                      type="number"
                      {...register(`entries.${index}.qty`, {
                        onChange: () => recomputeTotal(index),
                        valueAsNumber: true,
                      })}
                    />
                  </td>
                  <td>
                    <input {...register(`entries.${index}.qtyType`)} />
                  </td>
                  <td>
                    <input
                      type="number"
                      {...register(`entries.${index}.rate`, {
                        onChange: () => recomputeTotal(index),
                        valueAsNumber: true,
                      })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      {...register(`entries.${index}.total`, {
                        valueAsNumber: true,
                      })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {errors.entries?.message ? (
          <span className="form-error">{errors.entries.message}</span>
        ) : null}
        <div className="action-bar">
          <button
            onClick={() =>
              append({
                dateProvided: values.invoiceDate,
                description: "Additional service",
                qty: 1,
                qtyType: "unit",
                rate: 0,
                total: 0,
              })
            }
            type="button"
          >
            Add Line
          </button>
          <button
            onClick={() => void handleSubmit(saveInvoice)()}
            type="button"
          >
            Save Invoice
          </button>
          <button onClick={() => downloadInvoice("pdf")} type="button">
            <FontAwesomeIcon aria-hidden icon={faFilePdf} />
            PDF
          </button>
          <button onClick={() => downloadInvoice("doc")} type="button">
            <FontAwesomeIcon aria-hidden icon={faFileWord} />
            DOC
          </button>
          <button onClick={() => downloadInvoice("xls")} type="button">
            <FontAwesomeIcon aria-hidden icon={faFileExcel} />
            Excel
          </button>
          <span>{status}</span>
        </div>
      </div>
      <aside className="invoice-preview">
        <div className="invoice-preview-head">
          <span className="eyebrow">{preset.country}</span>
          <strong>Draft Invoice</strong>
        </div>
        <h2>
          {values.series}
          {values.invoiceNo}
        </h2>
        <p>
          {values.provider.companyName} to {values.customer.companyName}
        </p>
        <div className="invoice-summary-list">
          {values.entries.map((entry, index) => (
            <div key={`${entry.description}-${index}`}>
              <span>{entry.description}</span>
              <strong>
                {preset.currencySymbol} {Number(entry.total || 0).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>
              {preset.currencySymbol} {subtotal.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt>
              {preset.taxLabel} {preset.taxRate}%
            </dt>
            <dd>
              {preset.currencySymbol} {taxAmount.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>
              {preset.currencySymbol} {totalPayable.toFixed(2)}
            </dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}

function buildInvoiceDocument({
  country,
  currencySymbol,
  customerName,
  entries,
  invoiceDate,
  invoiceNo,
  providerName,
  providerTaxNo,
  series,
  subtotal,
  taxAmount,
  taxLabel,
  taxRate,
  totalPayable,
}: {
  country: string;
  currencySymbol: string;
  customerName: string;
  entries: {
    dateProvided: string;
    description: string;
    qty: number;
    qtyType: string;
    rate: number;
    total: number;
  }[];
  invoiceDate: string;
  invoiceNo: string;
  providerName: string;
  providerTaxNo: string;
  series: string;
  subtotal: number;
  taxAmount: number;
  taxLabel: string;
  taxRate: number;
  totalPayable: number;
}) {
  const rows = entries
    .map(
      (entry) => `
        <tr>
          <td>${entry.dateProvided}</td>
          <td>${entry.description}</td>
          <td>${entry.qty}</td>
          <td>${entry.qtyType}</td>
          <td>${currencySymbol} ${Number(entry.rate || 0).toFixed(2)}</td>
          <td>${currencySymbol} ${Number(entry.total || 0).toFixed(2)}</td>
        </tr>`,
    )
    .join("");
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${series}${invoiceNo}</title>
    <style>
      body { color: #132321; font-family: Arial, sans-serif; margin: 32px; }
      header { border-bottom: 2px solid #0f766e; display: flex; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; }
      h1 { color: #0f766e; margin: 0; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #bdcfca; padding: 10px; text-align: left; }
      th { background: #e9f4f1; }
      .totals { margin-left: auto; margin-top: 18px; width: 320px; }
      .totals div { display: flex; justify-content: space-between; padding: 8px 0; }
      .grand { border-top: 2px solid #0f766e; color: #0f766e; font-size: 18px; font-weight: 700; }
    </style>
  </head>
  <body>
    <header>
      <div>
        <h1>${series}${invoiceNo}</h1>
        <p>${country} / ${invoiceDate}</p>
      </div>
      <div>
        <strong>${providerName}</strong>
        <p>${providerTaxNo}</p>
      </div>
    </header>
    <p><strong>Bill To:</strong> ${customerName}</p>
    <table>
      <thead>
        <tr><th>Date</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Total</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <section class="totals">
      <div><span>Subtotal</span><strong>${currencySymbol} ${subtotal.toFixed(2)}</strong></div>
      <div><span>${taxLabel} ${taxRate}%</span><strong>${currencySymbol} ${taxAmount.toFixed(2)}</strong></div>
      <div class="grand"><span>Total</span><strong>${currencySymbol} ${totalPayable.toFixed(2)}</strong></div>
    </section>
  </body>
</html>`;
}
