"use client";

import { useEffect, useMemo, useState } from "react";

type Module = {
  id: string;
  title: string;
  group: string;
  metric: string;
  trend: string;
  description: string;
  columns: string[];
  rows: string[][];
  actions: string[];
};

const modules: Module[] = [
  {
    id: "dashboard",
    title: "Command Center",
    group: "Overview",
    metric: "INR 42.8L",
    trend: "+18% month revenue",
    description: "Executive view of leads, quotations, bookings, operations, receivables, and gross profit.",
    columns: ["Signal", "Today", "Owner", "Status"],
    rows: [
      ["New travel enquiries", "38", "Sales", "Healthy"],
      ["Quotes awaiting approval", "14", "Sales", "Watch"],
      ["Trips in operation", "22", "Operations", "Active"],
      ["Supplier confirmations pending", "7", "Ops Desk", "Risk"],
    ],
    actions: ["Refresh KPIs", "Open Hot Leads", "View Operations"],
  },
  {
    id: "leads",
    title: "CRM Leads",
    group: "Sales",
    metric: "428",
    trend: "82 hot leads",
    description: "Capture website, WhatsApp, phone, referral, campaign, and B2B agent enquiries in one sales pipeline.",
    columns: ["Lead", "Destination", "Source", "Stage", "Owner", "Next Follow-up"],
    rows: [
      ["Sharma Family", "Dubai", "Website", "Requirement", "Ritika", "Today 4:30 PM"],
      ["Mehta Group", "Singapore", "B2B Agent", "Quotation Sent", "Aman", "Tomorrow"],
      ["Corporate Offsite", "Goa", "LinkedIn", "New", "Unassigned", "Today"],
      ["Nair Honeymoon", "Bali", "WhatsApp", "Negotiation", "Sara", "01 Aug"],
    ],
    actions: ["Create Lead", "Assign", "Schedule Follow-up", "Convert to Quote"],
  },
  {
    id: "quotations",
    title: "Quotation Builder",
    group: "Sales",
    metric: "96",
    trend: "INR 18.2L open value",
    description: "Build hotel, transfer, activity, visa, flight, markup, discount, tax, and final customer pricing.",
    columns: ["Quote", "Customer", "Destination", "Internal Cost", "Selling Price", "Status"],
    rows: [
      ["Q-1029", "Sharma Family", "Dubai", "INR 1,00,000", "INR 1,29,500", "Sent"],
      ["Q-1030", "Mehta Group", "Singapore", "INR 7,20,000", "INR 8,64,000", "Draft"],
      ["Q-1031", "Nair Honeymoon", "Bali", "INR 1,56,000", "INR 1,92,000", "Negotiation"],
    ],
    actions: ["Create Quote", "Calculate Price", "Generate PDF", "Send WhatsApp"],
  },
  {
    id: "itineraries",
    title: "Itinerary Builder",
    group: "Sales",
    metric: "64",
    trend: "12 templates ready",
    description: "Create day-wise itineraries with hotels, activities, transfers, meals, notes, images, and shareable links.",
    columns: ["Itinerary", "Days", "Destination", "Primary Theme", "Owner", "Status"],
    rows: [
      ["Dubai Family 5N", "6", "Dubai", "Family leisure", "Ritika", "Ready"],
      ["Singapore MICE 3N", "4", "Singapore", "Corporate", "Aman", "Draft"],
      ["Bali Honeymoon 6N", "7", "Bali", "Luxury", "Sara", "Ready"],
    ],
    actions: ["Add Day", "Duplicate Template", "Attach Media", "Publish Link"],
  },
  {
    id: "bookings",
    title: "Bookings",
    group: "Operations",
    metric: "125",
    trend: "22 upcoming this week",
    description: "Convert accepted quotations into bookings, passengers, documents, vouchers, payments, and operations tasks.",
    columns: ["Booking", "Customer", "Travel Dates", "Destination", "Payment", "Status"],
    rows: [
      ["BKG-2081", "Sharma Family", "25 Dec - 30 Dec", "Dubai", "Advance Paid", "Confirmed"],
      ["BKG-2082", "Mehta Group", "12 Aug - 15 Aug", "Singapore", "Pending", "Part Confirmed"],
      ["BKG-2083", "Kapoor Couple", "08 Sep - 14 Sep", "Europe", "Paid", "Documents"],
    ],
    actions: ["Create Booking", "Add Passenger", "Generate Voucher", "Request Payment"],
  },
  {
    id: "operations",
    title: "DMC Operations",
    group: "Operations",
    metric: "47",
    trend: "7 supplier risks",
    description: "Manage hotel confirmations, airport transfers, activity tickets, drivers, guides, issues, and trip monitoring.",
    columns: ["Operation", "Customer", "Service", "Supplier", "Due", "Status"],
    rows: [
      ["OPS-551", "Sharma Family", "Airport Pickup", "DXB Prime Cars", "25 Dec 08:30", "Assigned"],
      ["OPS-552", "Sharma Family", "Burj Khalifa", "Dubai Tickets Co", "26 Dec", "Confirmed"],
      ["OPS-553", "Mehta Group", "Hotel Rooms", "Marina Bay Hotel", "Today", "Pending"],
    ],
    actions: ["Assign Driver", "Confirm Supplier", "Open Issue", "Share Voucher"],
  },
  {
    id: "b2b",
    title: "B2B Agents",
    group: "Partners",
    metric: "86",
    trend: "INR 8.5L receivable",
    description: "Manage agent KYC, enquiries, credit limits, commission, pricing, bookings, invoices, and vouchers inside admin CRM.",
    columns: ["Agent", "Market", "Credit Limit", "Receivable", "Commission", "Status"],
    rows: [
      ["Skyline Travels", "Delhi", "INR 10L", "INR 2.4L", "INR 84K", "Active"],
      ["Pearl Holidays", "Mumbai", "INR 5L", "INR 76K", "INR 31K", "KYC Review"],
      ["Gulf Desk", "Dubai", "INR 20L", "INR 5.1L", "INR 1.2L", "Active"],
    ],
    actions: ["Approve KYC", "Set Credit", "Create Agent Quote", "Issue Invoice"],
  },
  {
    id: "suppliers",
    title: "Suppliers",
    group: "Inventory",
    metric: "312",
    trend: "41 active contracts",
    description: "Maintain hotels, transport, drivers, guides, activity providers, visa consultants, contracts, rates, and payables.",
    columns: ["Supplier", "Type", "Destination", "Rate Validity", "Payable", "Rating"],
    rows: [
      ["Hotel ABC", "Hotel", "Dubai", "01 Oct - 31 Dec", "INR 1.8L", "4.6"],
      ["DXB Prime Cars", "Transport", "Dubai", "Annual", "INR 72K", "4.8"],
      ["Island Trails", "Activities", "Bali", "Seasonal", "INR 44K", "4.5"],
    ],
    actions: ["Add Supplier", "Upload Contract", "Update Rate", "Request Confirmation"],
  },
  {
    id: "finance",
    title: "Travel Finance",
    group: "Business",
    metric: "INR 12.4L",
    trend: "29% gross margin",
    description: "Track customer receivables, supplier payables, agent commissions, refunds, taxes, expenses, and booking profit.",
    columns: ["Booking", "Selling Price", "Supplier Cost", "Commission", "Net Profit", "Status"],
    rows: [
      ["BKG-2081", "INR 1,29,500", "INR 1,00,000", "INR 0", "INR 25,000", "Healthy"],
      ["BKG-2082", "INR 8,64,000", "INR 7,20,000", "INR 48,000", "INR 91,000", "Watch"],
      ["BKG-2083", "INR 5,20,000", "INR 4,30,000", "INR 0", "INR 74,000", "Healthy"],
    ],
    actions: ["Record Payment", "Approve Refund", "Export Ledger", "Profit Report"],
  },
  {
    id: "invoices",
    title: "Invoice Builder",
    group: "Finance",
    metric: "Multi-tax",
    trend: "Country-aware invoices",
    description: "Generate travel invoices with provider/customer details, dynamic line items, country tax rules, currency, numbering, totals, and API persistence.",
    columns: ["Invoice", "Customer", "Country", "Tax", "Total", "Status"],
    rows: [["TRV-0001", "Sharma Family", "India", "GST 18%", "₹129,500", "Draft"]],
    actions: ["Generate Number", "Save Invoice", "Print Preview", "Lock Invoice"],
  },
  {
    id: "marketing",
    title: "Marketing ROI",
    group: "Growth",
    metric: "3.9x",
    trend: "Google best channel",
    description: "Track campaigns, lead sources, quotations, bookings, revenue, WhatsApp broadcasts, and acquisition ROI.",
    columns: ["Campaign", "Channel", "Leads", "Quotes", "Bookings", "ROI"],
    rows: [
      ["Dubai December", "Google Ads", "100", "20", "5", "5.0x"],
      ["Bali Honeymoon", "Instagram", "80", "18", "4", "4.1x"],
      ["Agent Network", "B2B", "62", "28", "9", "6.4x"],
    ],
    actions: ["Create Campaign", "Import Leads", "WhatsApp Broadcast", "ROI Report"],
  },
];

const navGroups = [
  { title: "Control", items: ["dashboard", "leads", "quotations", "itineraries"] },
  { title: "Execution", items: ["bookings", "operations", "suppliers"] },
  { title: "Business", items: ["b2b", "finance", "invoices", "marketing"] },
];

const kpis = [
  ["New Leads", "38", "+12 today"],
  ["Open Quotes", "INR 18.2L", "14 awaiting approval"],
  ["Trips Active", "22", "7 start this week"],
  ["Gross Profit", "INR 12.4L", "29% margin"],
];

type ApiRecord = {
  id: string;
  moduleKey: string;
  title: string;
  status: string;
  priority: string;
  payload: Record<string, unknown>;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export function CrmShell() {
  const [selectedId, setSelectedId] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("TripOS workspace ready.");
  const [apiRows, setApiRows] = useState<string[][]>([]);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const selected = modules.find((module) => module.id === selectedId) ?? modules[0];
  const moduleApiKey = selectedId === "b2b" ? "b2b-agents" : selectedId;
  useEffect(() => {
    let cancelled = false;
    async function loadRecords() {
      setIsLoadingRows(true);
      try {
        const response = await fetch(`${apiBaseUrl}/tripos/records/${moduleApiKey}`);
        if (!response.ok) throw new Error("API unavailable");
        const records = (await response.json()) as ApiRecord[];
        if (!cancelled) {
          setApiRows(records.map((record) => recordToRow(record, selected)));
          setToast(`Loaded ${records.length} ${selected.title} records from TripOS API.`);
        }
      } catch {
        if (!cancelled) {
          setApiRows([]);
          setToast("Using local demo rows. Start API server for DB-backed records.");
        }
      } finally {
        if (!cancelled) setIsLoadingRows(false);
      }
    }
    void loadRecords();
    return () => {
      cancelled = true;
    };
  }, [moduleApiKey, selected]);
  const activeRows = apiRows.length ? apiRows : selected.rows;
  const filteredRows = useMemo(
    () =>
      activeRows.filter((row) =>
        row.join(" ").toLowerCase().includes(query.toLowerCase()),
      ),
    [activeRows, query],
  );

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setSelectedId("dashboard")} type="button">
          <span className="brand-mark">T</span>
          <span>
            <strong>TripOS</strong>
            <small>Travel Operating System</small>
          </span>
        </button>
        <nav aria-label="TripOS modules">
          {navGroups.map((group) => (
            <section className="nav-group" key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map((id) => {
                const module = modules.find((item) => item.id === id);
                if (!module) return null;
                return (
                  <button
                    className={selectedId === id ? "selected" : ""}
                    key={id}
                    onClick={() => setSelectedId(id)}
                    type="button"
                  >
                    <span>{module.title}</span>
                    <em>{module.metric}</em>
                  </button>
                );
              })}
            </section>
          ))}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Webnza Demo Tenant / Delhi Branch</span>
            <h1>{selected.title}</h1>
          </div>
          <div className="top-actions">
            <input
              aria-label="Search records"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search records"
              value={query}
            />
            <button onClick={() => setToast(`${selected.title}: action queued`)} type="button">
              Sync
            </button>
          </div>
        </header>

        <section className="hero-panel">
          <div>
            <span className="eyebrow">{selected.group}</span>
            <h2>{selected.metric}</h2>
            <p>{selected.description}</p>
          </div>
          <strong>{selected.trend}</strong>
        </section>

        <section className="kpi-grid" aria-label="TripOS metrics">
          {kpis.map(([label, value, helper]) => (
            <article className="metric-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{helper}</p>
            </article>
          ))}
        </section>

        <section className="action-bar" aria-label={`${selected.title} actions`}>
          {selected.actions.map((action) => (
            <button
              key={action}
              onClick={() => setToast(`${action} is ready for ${selected.title}.`)}
              type="button"
            >
              {action}
            </button>
          ))}
        </section>

        {selectedId === "invoices" ? <InvoiceBuilder /> : null}

        {selectedId !== "invoices" ? <section className="table-card">
          <div className="table-head">
            <div>
              <span className="eyebrow">{selected.title}</span>
              <h2>Live Work Queue</h2>
            </div>
            <strong>{isLoadingRows ? "Loading" : `${filteredRows.length} records`}</strong>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {selected.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.join("-")}>
                    {row.map((cell, index) => (
                      <td key={`${cell}-${index}`}>{renderCell(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section> : null}

        <section className="quick-grid">
          <article>
            <span className="eyebrow">Lead to Booking</span>
            <strong>New &gt; Quote &gt; Payment &gt; Booking &gt; Operations</strong>
            <p>Primary MVP workflow for travel agencies and DMC teams.</p>
          </article>
          <article>
            <span className="eyebrow">B2B Inside CRM</span>
            <strong>Agent roles, KYC, credit, quotes, commissions</strong>
            <p>Partners use restricted CRM views until a separate portal is justified.</p>
          </article>
          <article>
            <span className="eyebrow">AI Ready</span>
            <strong>Itinerary and quotation assistant hooks</strong>
            <p>Central AI service can later draft trips from destination, budget, and dates.</p>
          </article>
        </section>

        <div className="toast" role="status">{toast}</div>
      </main>
    </div>
  );
}

const countryPresets = {
  IN: { country: "India", currencyCode: "INR", currencySymbol: "₹", taxLabel: "GST", taxRate: 18 },
  AE: { country: "United Arab Emirates", currencyCode: "AED", currencySymbol: "د.إ", taxLabel: "VAT", taxRate: 5 },
  GB: { country: "United Kingdom", currencyCode: "GBP", currencySymbol: "£", taxLabel: "VAT", taxRate: 20 },
  EU: { country: "European Union", currencyCode: "EUR", currencySymbol: "€", taxLabel: "VAT", taxRate: 21 },
  US: { country: "United States", currencyCode: "USD", currencySymbol: "$", taxLabel: "Sales Tax", taxRate: 0 },
};

type CountryCode = keyof typeof countryPresets;

function InvoiceBuilder() {
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [series, setSeries] = useState("TRV-");
  const [invoiceNo, setInvoiceNo] = useState("0001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [providerName, setProviderName] = useState("Webnza Travels");
  const [providerTaxNo, setProviderTaxNo] = useState("GSTIN-TRIPOS-DEMO");
  const [customerName, setCustomerName] = useState("Sharma Family");
  const [customerTaxNo, setCustomerTaxNo] = useState("");
  const [entries, setEntries] = useState([
    { dateProvided: invoiceDate, description: "Dubai hotel, transfers, and activities package", qty: 1, qtyType: "package", rate: 100000, total: 100000 },
  ]);
  const [status, setStatus] = useState("Ready to create invoice.");
  const preset = countryPresets[countryCode];
  const subtotal = entries.reduce((sum, entry) => sum + Number(entry.total || 0), 0);
  const taxAmount = subtotal * (preset.taxRate / 100);
  const totalPayable = subtotal + taxAmount;

  function updateEntry(index: number, field: keyof typeof entries[number], value: string) {
    setEntries((current) =>
      current.map((entry, entryIndex) => {
        if (entryIndex !== index) return entry;
        const next = { ...entry, [field]: field === "description" || field === "qtyType" || field === "dateProvided" ? value : Number(value) };
        if (field === "qty" || field === "rate") {
          next.total = Number(next.qty || 0) * Number(next.rate || 0);
        }
        if (field === "total") {
          next.rate = Number(next.qty || 1) ? Number(next.total || 0) / Number(next.qty || 1) : 0;
        }
        return next;
      }),
    );
  }

  async function generateNumber() {
    const response = await fetch(`${apiBaseUrl}/tripos/invoices/next-number/${encodeURIComponent(series)}`);
    const result = (await response.json()) as { invoiceNo?: string };
    setInvoiceNo(result.invoiceNo ?? "0001");
    setStatus("Invoice number generated from backend history.");
  }

  async function saveInvoice() {
    const response = await fetch(`${apiBaseUrl}/tripos/invoices`, {
      body: JSON.stringify({
        invoiceSeries: series,
        invoiceNo,
        invoiceDate,
        countryCode,
        currencyCode: preset.currencyCode,
        currencySymbol: preset.currencySymbol,
        taxLabel: preset.taxLabel,
        taxRate: preset.taxRate,
        provider: { companyName: providerName, taxNo: providerTaxNo },
        customer: { companyName: customerName, taxNo: customerTaxNo },
        entries,
        status: "draft",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) {
      setStatus("Invoice save failed. Check API server.");
      return;
    }
    setStatus("Invoice saved to TripOS API and Finance records.");
  }

  return (
    <section className="invoice-builder">
      <div className="invoice-form-panel">
        <div className="table-head">
          <div>
            <span className="eyebrow">Travel Invoice Utility</span>
            <h2>Country, tax, currency, and line-item invoice builder</h2>
          </div>
          <button onClick={generateNumber} type="button">Generate Number</button>
        </div>
        <div className="invoice-form-grid">
          <label>Country<select value={countryCode} onChange={(event) => setCountryCode(event.target.value as CountryCode)}>{Object.entries(countryPresets).map(([code, item]) => <option key={code} value={code}>{item.country}</option>)}</select></label>
          <label>Series<input value={series} onChange={(event) => setSeries(event.target.value)} /></label>
          <label>Invoice No<input value={invoiceNo} onChange={(event) => setInvoiceNo(event.target.value)} /></label>
          <label>Date<input type="date" value={invoiceDate} onChange={(event) => setInvoiceDate(event.target.value)} /></label>
          <label>Provider<input value={providerName} onChange={(event) => setProviderName(event.target.value)} /></label>
          <label>Provider Tax No<input value={providerTaxNo} onChange={(event) => setProviderTaxNo(event.target.value)} /></label>
          <label>Customer<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} /></label>
          <label>Customer Tax No<input value={customerTaxNo} onChange={(event) => setCustomerTaxNo(event.target.value)} /></label>
        </div>
        <div className="table-wrap invoice-lines">
          <table>
            <thead><tr><th>Date</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Total</th></tr></thead>
            <tbody>{entries.map((entry, index) => <tr key={index}>
              <td><input type="date" value={entry.dateProvided} onChange={(event) => updateEntry(index, "dateProvided", event.target.value)} /></td>
              <td><input value={entry.description} onChange={(event) => updateEntry(index, "description", event.target.value)} /></td>
              <td><input type="number" value={entry.qty} onChange={(event) => updateEntry(index, "qty", event.target.value)} /></td>
              <td><input value={entry.qtyType} onChange={(event) => updateEntry(index, "qtyType", event.target.value)} /></td>
              <td><input type="number" value={entry.rate} onChange={(event) => updateEntry(index, "rate", event.target.value)} /></td>
              <td><input type="number" value={entry.total} onChange={(event) => updateEntry(index, "total", event.target.value)} /></td>
            </tr>)}</tbody>
          </table>
        </div>
        <div className="action-bar">
          <button onClick={() => setEntries([...entries, { dateProvided: invoiceDate, description: "Additional service", qty: 1, qtyType: "unit", rate: 0, total: 0 }])} type="button">Add Line</button>
          <button onClick={saveInvoice} type="button">Save Invoice</button>
          <span>{status}</span>
        </div>
      </div>
      <aside className="invoice-preview">
        <span className="eyebrow">{preset.country} / {preset.currencyCode}</span>
        <h2>{series}{invoiceNo}</h2>
        <p>{providerName} to {customerName}</p>
        <dl>
          <div><dt>Subtotal</dt><dd>{preset.currencySymbol}{subtotal.toFixed(2)}</dd></div>
          <div><dt>{preset.taxLabel} {preset.taxRate}%</dt><dd>{preset.currencySymbol}{taxAmount.toFixed(2)}</dd></div>
          <div><dt>Total Payable</dt><dd>{preset.currencySymbol}{totalPayable.toFixed(2)}</dd></div>
        </dl>
      </aside>
    </section>
  );
}

function recordToRow(record: ApiRecord, module: Module) {
  return module.columns.map((column, index) => {
    if (index === 0) return record.title;
    const key = column
      .toLowerCase()
      .replace(/[^a-z0-9]+(.)/g, (_, character: string) => character.toUpperCase());
    const value = record.payload[key] ?? record.payload[column] ?? record.payload[column.toLowerCase()];
    if (value !== undefined && value !== null) return String(value);
    if (column.toLowerCase() === "status") return record.status;
    if (column.toLowerCase() === "owner") return String(record.payload.owner ?? "Team");
    return "-";
  });
}

function renderCell(value: string) {
  const normalized = value.toLowerCase();
  if (["healthy", "active", "confirmed", "ready", "paid", "assigned"].includes(normalized)) {
    return <span className="badge good">{value}</span>;
  }
  if (["watch", "pending", "draft", "sent", "documents", "kyc review", "part confirmed"].includes(normalized)) {
    return <span className="badge warn">{value}</span>;
  }
  if (["risk"].includes(normalized)) {
    return <span className="badge danger">{value}</span>;
  }
  return value;
}
