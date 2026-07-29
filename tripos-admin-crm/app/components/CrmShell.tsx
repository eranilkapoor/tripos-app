"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ApiRecord, CrmModule, CrmSession, ModuleField } from "./crmTypes";
import { apiBaseUrl, getRecordId, normalizeRecords, recordToRow, sessionHeaders, statusClass, toPayload } from "./crmUtils";

const modules: CrmModule[] = [
  { id: "dashboard", title: "Command Center", group: "Overview", description: "Live operating view across sales, bookings, operations, partners, suppliers, documents, support, and finance.", columns: ["Signal", "Value", "Owner", "Status"], rowMap: [], fields: [] },
  { id: "leads", title: "Leads", group: "Sales", endpoint: "leads", description: "Capture B2C, B2B, corporate, campaign, phone, WhatsApp, referral, and website enquiries.", columns: ["Customer", "Destination", "Source", "Stage", "Owner", "Phone"], rowMap: ["customerName", "requirement.destination", "source", "stage", "assignedTo", "phone"], stageEndpoint: true, statusOptions: ["new", "assigned", "contacted", "requirement_collected", "quotation_prepared", "quotation_sent", "negotiation", "won", "lost"], fields: [
    { key: "customerName", label: "Customer", required: true },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email", type: "email" },
    { key: "source", label: "Source", required: true, placeholder: "Website, WhatsApp, Agent" },
    { key: "channel", label: "Channel", type: "select", options: ["b2c", "b2b", "corporate"] },
    { key: "requirement.destination", label: "Destination" },
    { key: "requirement.travelDate", label: "Travel Date", type: "date" },
    { key: "requirement.adults", label: "Adults", type: "number" },
    { key: "assignedTo", label: "Owner" },
  ] },
  { id: "customers", title: "Customers", group: "Sales", endpoint: "customers", description: "Customer master for B2C travellers, repeat customers, families, and corporate contacts.", columns: ["Customer", "Phone", "Email", "Type", "City", "Status"], rowMap: ["name", "phone", "email", "customerType", "city", "status"], statusOptions: ["active", "inactive", "blocked"], fields: [
    { key: "name", label: "Customer", required: true },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email", type: "email" },
    { key: "customerType", label: "Type", type: "select", options: ["b2c", "corporate", "family", "repeat"] },
    { key: "source", label: "Source" },
    { key: "city", label: "City" },
    { key: "country", label: "Country" },
  ] },
  { id: "quotations", title: "Quotations", group: "Sales", endpoint: "quotations", description: "Build customer pricing with travel dates, travellers, service costs, markup, discount, and status tracking.", columns: ["Customer", "Destination", "Travel Dates", "Travellers", "Total", "Status"], rowMap: ["customerName", "destination", "travelDates", "travellers", "sellingPrice", "status"], statusOptions: ["draft", "sent", "accepted", "rejected", "expired"], fields: [
    { key: "customerName", label: "Customer", required: true },
    { key: "destination", label: "Destination", required: true },
    { key: "travelDates", label: "Travel Dates" },
    { key: "travellers", label: "Travellers", type: "number" },
    { key: "pricing.baseCost", label: "Base Cost", type: "number" },
    { key: "pricing.markup", label: "Markup", type: "number" },
    { key: "pricing.discount", label: "Discount", type: "number" },
  ] },
  { id: "itineraries", title: "Itineraries", group: "Sales", endpoint: "itineraries", description: "Create and maintain day-wise travel plans, templates, themes, and customer-ready itinerary content.", columns: ["Itinerary", "Destination", "Days", "Theme", "Status"], rowMap: ["title", "destination", "durationDays", "theme", "status"], statusOptions: ["draft", "ready", "shared", "archived"], fields: [
    { key: "title", label: "Itinerary", required: true },
    { key: "destination", label: "Destination", required: true },
    { key: "durationDays", label: "Days", type: "number" },
    { key: "theme", label: "Theme" },
  ] },
  { id: "bookings", title: "Bookings", group: "Operations", endpoint: "bookings", description: "Confirmed travel files with passengers, services, documents, payments, vouchers, and trip status.", columns: ["Customer", "Destination", "Travel Dates", "Passengers", "Services", "Status"], rowMap: ["customerName", "destination", "travelDates", "passengers", "services", "status"], statusOptions: ["draft", "pending_payment", "confirmed", "partially_confirmed", "cancelled", "completed"], fields: [
    { key: "customerName", label: "Customer", required: true },
    { key: "destination", label: "Destination", required: true },
    { key: "travelDates", label: "Travel Dates" },
    { key: "quotationId", label: "Quotation ID" },
    { key: "leadId", label: "Lead ID" },
  ] },
  { id: "operations", title: "Operations", group: "Operations", endpoint: "operations", description: "DMC execution tasks for hotels, transfers, visas, tickets, guides, confirmations, and supplier follow-ups.", columns: ["Task", "Booking", "Service", "Owner", "Due", "Status"], rowMap: ["title", "bookingCode", "serviceType", "owner", "dueDate", "status"], statusOptions: ["pending", "assigned", "confirmed", "in_progress", "blocked", "completed"], fields: [
    { key: "title", label: "Task", required: true },
    { key: "bookingCode", label: "Booking Code" },
    { key: "serviceType", label: "Service", required: true },
    { key: "owner", label: "Owner" },
    { key: "dueDate", label: "Due Date", type: "date" },
    { key: "priority", label: "Priority", type: "select", options: ["low", "medium", "high", "urgent"] },
  ] },
  { id: "suppliers", title: "Suppliers", group: "Inventory", endpoint: "suppliers", description: "Hotels, transporters, activity vendors, guides, DMC partners, contracts, credit limits, ratings, and payables.", columns: ["Supplier", "Type", "Destination", "Credit Limit", "Rating", "Status"], rowMap: ["name", "type", "destination", "creditLimit", "rating", "status"], statusOptions: ["active", "inactive", "blacklisted"], fields: [
    { key: "name", label: "Supplier", required: true },
    { key: "type", label: "Type", required: true },
    { key: "destination", label: "Destination" },
    { key: "creditLimit", label: "Credit Limit", type: "number" },
    { key: "rating", label: "Rating", type: "number" },
  ] },
  { id: "b2b-agents", title: "B2B Agents", group: "Partners", endpoint: "b2b-agents", description: "Agent onboarding, KYC status, market, credit limit, commission, receivables, and partner activity.", columns: ["Agency", "Contact", "Market", "Credit Limit", "Commission", "Status"], rowMap: ["agencyName", "contactName", "market", "creditLimit", "commissionRate", "status"], statusOptions: ["pending_kyc", "active", "on_hold", "blocked"], fields: [
    { key: "agencyName", label: "Agency", required: true },
    { key: "contactName", label: "Contact", required: true },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone" },
    { key: "market", label: "Market" },
    { key: "creditLimit", label: "Credit Limit", type: "number" },
    { key: "commissionRate", label: "Commission %", type: "number" },
  ] },
  { id: "payments", title: "Payments", group: "Finance", endpoint: "payments", description: "Receivables, payables, agent collections, supplier dues, refunds, due dates, and payment status.", columns: ["Type", "Party", "Amount", "Currency", "Due", "Status"], rowMap: ["type", "partyName", "amount", "currencyCode", "dueDate", "status"], statusOptions: ["pending", "partial", "paid", "overdue", "cancelled"], fields: [
    { key: "type", label: "Type", required: true, type: "select", options: ["receivable", "payable", "refund", "commission"] },
    { key: "partyName", label: "Party" },
    { key: "amount", label: "Amount", required: true, type: "number" },
    { key: "currencyCode", label: "Currency" },
    { key: "bookingId", label: "Booking ID" },
    { key: "dueDate", label: "Due Date", type: "date" },
  ] },
  { id: "destinations", title: "Destinations", group: "Inventory", endpoint: "destinations", description: "Destination master with country, region, season, highlights, and visa requirement notes.", columns: ["Destination", "Country", "Region", "Season", "Highlights", "Status"], rowMap: ["name", "country", "region", "bestSeason", "highlights", "status"], statusOptions: ["active", "inactive"], fields: [
    { key: "name", label: "Destination", required: true },
    { key: "country", label: "Country", required: true },
    { key: "region", label: "Region" },
    { key: "bestSeason", label: "Best Season" },
    { key: "highlights", label: "Highlights", type: "tags" },
    { key: "visaRequirement", label: "Visa Requirement", type: "textarea" },
  ] },
  { id: "tour-packages", title: "Tour Packages", group: "Inventory", endpoint: "tour-packages", description: "Reusable products and packages for B2C customers, B2B agents, campaigns, and quick quotations.", columns: ["Package", "Destination", "Category", "Days", "Base Price", "Status"], rowMap: ["title", "destination", "category", "durationDays", "basePrice", "status"], statusOptions: ["draft", "active", "inactive", "archived"], fields: [
    { key: "title", label: "Package", required: true },
    { key: "destination", label: "Destination", required: true },
    { key: "category", label: "Category" },
    { key: "durationDays", label: "Days", type: "number" },
    { key: "basePrice", label: "Base Price", type: "number" },
    { key: "currency", label: "Currency" },
    { key: "inclusions", label: "Inclusions", type: "tags" },
  ] },
  { id: "travel-documents", title: "Travel Documents", group: "Operations", endpoint: "travel-documents", description: "Passport, visa, insurance, ticket, and customer document workflow for each booking.", columns: ["Customer", "Booking", "Document", "Number", "Expiry", "Status"], rowMap: ["customerName", "bookingId", "documentType", "documentNumber", "expiryDate", "status"], statusOptions: ["pending", "received", "verified", "expired", "rejected"], fields: [
    { key: "customerName", label: "Customer", required: true },
    { key: "bookingId", label: "Booking ID" },
    { key: "documentType", label: "Document Type", required: true },
    { key: "documentNumber", label: "Document Number" },
    { key: "expiryDate", label: "Expiry", type: "date" },
    { key: "fileUrl", label: "File URL" },
  ] },
  { id: "vouchers", title: "Vouchers", group: "Operations", endpoint: "vouchers", description: "Hotel, transfer, activity, visa, guide, and customer vouchers issued from booking files.", columns: ["Booking", "Customer", "Type", "Supplier", "Confirmation", "Status"], rowMap: ["bookingId", "customerName", "voucherType", "supplierName", "confirmationNumber", "status"], statusOptions: ["draft", "issued", "sent", "cancelled"], fields: [
    { key: "bookingId", label: "Booking ID", required: true },
    { key: "customerName", label: "Customer", required: true },
    { key: "voucherType", label: "Voucher Type", required: true },
    { key: "supplierName", label: "Supplier" },
    { key: "issueDate", label: "Issue Date", type: "date" },
    { key: "confirmationNumber", label: "Confirmation No" },
  ] },
  { id: "support-tickets", title: "Support Tickets", group: "Support", endpoint: "support-tickets", description: "Customer, agent, supplier, and operations issue tracking with SLA-friendly statuses.", columns: ["Subject", "Customer", "Booking", "Channel", "Priority", "Status"], rowMap: ["subject", "customerName", "bookingId", "channel", "priority", "status"], statusOptions: ["open", "in_progress", "waiting_customer", "resolved", "closed"], fields: [
    { key: "subject", label: "Subject", required: true },
    { key: "customerName", label: "Customer", required: true },
    { key: "bookingId", label: "Booking ID" },
    { key: "channel", label: "Channel" },
    { key: "priority", label: "Priority", type: "select", options: ["low", "medium", "high", "urgent"] },
    { key: "description", label: "Description", type: "textarea" },
  ] },
  { id: "campaigns", title: "Campaigns", group: "Growth", endpoint: "campaigns", description: "Marketing ROI tracking for lead source, campaign spend, quotations, bookings, revenue, and status.", columns: ["Campaign", "Channel", "Leads", "Quotes", "Bookings", "Revenue"], rowMap: ["name", "channel", "leads", "quotations", "bookings", "revenue"], statusOptions: ["draft", "active", "paused", "completed", "archived"], fields: [
    { key: "name", label: "Campaign", required: true },
    { key: "channel", label: "Channel", required: true },
    { key: "source", label: "Source" },
    { key: "spend", label: "Spend", type: "number" },
    { key: "leads", label: "Leads", type: "number" },
    { key: "quotations", label: "Quotes", type: "number" },
    { key: "bookings", label: "Bookings", type: "number" },
    { key: "revenue", label: "Revenue", type: "number" },
  ] },
  { id: "invoices", title: "Invoice Builder", group: "Finance", endpoint: "finance/invoices", description: "Country-aware invoice utility with provider, customer, tax rules, dynamic line items, and API persistence.", columns: ["Invoice", "Customer", "Country", "Tax", "Total", "Status"], rowMap: ["invoiceNo", "customer.companyName", "countryCode", "taxLabel", "totalPayable", "status"], fields: [] },
];

const navGroups = [
  { title: "Control", items: ["dashboard", "leads", "customers", "quotations", "itineraries"] },
  { title: "Execution", items: ["bookings", "operations", "travel-documents", "vouchers", "support-tickets"] },
  { title: "Inventory", items: ["destinations", "tour-packages", "suppliers"] },
  { title: "Business", items: ["b2b-agents", "payments", "invoices", "campaigns"] },
];

const countryPresets = {
  IN: { country: "India", currencyCode: "INR", currencySymbol: "INR", taxLabel: "GST", taxRate: 18 },
  AE: { country: "United Arab Emirates", currencyCode: "AED", currencySymbol: "AED", taxLabel: "VAT", taxRate: 5 },
  GB: { country: "United Kingdom", currencyCode: "GBP", currencySymbol: "GBP", taxLabel: "VAT", taxRate: 20 },
  EU: { country: "European Union", currencyCode: "EUR", currencySymbol: "EUR", taxLabel: "VAT", taxRate: 21 },
  US: { country: "United States", currencyCode: "USD", currencySymbol: "USD", taxLabel: "Sales Tax", taxRate: 0 },
};

type CountryCode = keyof typeof countryPresets;

export default function CrmShell() {
  const router = useRouter();
  const pathname = usePathname();
  const pathModule = pathname.split("/").filter(Boolean)[0];
  const initialModule = modules.some((item) => item.id === pathModule) ? pathModule : "dashboard";
  const [selectedId, setSelectedId] = useState(initialModule);
  const [records, setRecords] = useState<ApiRecord[]>([]);
  const [dashboard, setDashboard] = useState<Record<string, unknown> | null>(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("TripOS CRM connected to production APIs.");
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ApiRecord | null>(null);
  const [session, setSession] = useState<CrmSession | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const selected = modules.find((item) => item.id === selectedId) ?? modules[0];

  useEffect(() => {
    const raw = window.localStorage.getItem("tripos-crm-session");
    if (!raw) {
      setAuthReady(true);
      return;
    }
    try {
      const stored = JSON.parse(raw) as CrmSession;
      setSession(stored);
      void fetch(`${apiBaseUrl}/auth/me`, { headers: sessionHeaders(stored.token, stored.user) })
        .then((response) => response.ok ? response.json() : Promise.reject(new Error("Session expired")))
        .then((nextSession) => setSession({ ...stored, ...nextSession }))
        .catch(() => {
          window.localStorage.removeItem("tripos-crm-session");
          setSession(null);
        })
        .finally(() => setAuthReady(true));
    } catch {
      window.localStorage.removeItem("tripos-crm-session");
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    if (pathModule && modules.some((item) => item.id === pathModule)) setSelectedId(pathModule);
  }, [pathModule]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (session) void loadModule(selected, query);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [selectedId, query, session]);

  async function loadModule(module: CrmModule, search = query) {
    setIsLoading(true);
    setSelectedRecord(null);
    try {
      if (module.id === "dashboard") {
        const response = await fetch(`${apiBaseUrl}/tripos/dashboard`, { cache: "no-store", headers: sessionHeaders(session?.token, session?.user) });
        if (!response.ok) throw new Error("Dashboard API unavailable");
        setDashboard((await response.json()) as Record<string, unknown>);
        setRecords([]);
      } else if (module.endpoint) {
        const params = new URLSearchParams({ limit: "100" });
        if (search.trim()) params.set("search", search.trim());
        const response = await fetch(`${apiBaseUrl}/${module.endpoint}?${params.toString()}`, { cache: "no-store", headers: sessionHeaders(session?.token, session?.user) });
        if (!response.ok) throw new Error(`${module.title} API unavailable`);
        setRecords(normalizeRecords(await response.json()));
      }
      setToast(`${module.title} refreshed from TripOS API.`);
    } catch (error) {
      setRecords([]);
      setToast(error instanceof Error ? error.message : "API unavailable.");
    } finally {
      setIsLoading(false);
    }
  }

  function selectModule(id: string) {
    setSelectedId(id);
    router.push(id === "dashboard" ? "/" : `/${id}`);
  }

  async function createRecord(values: Record<string, string>) {
    if (!selected.endpoint) return;
    const response = await fetch(`${apiBaseUrl}/${selected.endpoint}`, {
      body: JSON.stringify(toPayload(selected.fields, values)),
      headers: { "Content-Type": "application/json", ...sessionHeaders(session?.token, session?.user) },
      method: "POST",
    });
    if (!response.ok) throw new Error(`Could not create ${selected.title}`);
    setModalOpen(false);
    await loadModule(selected);
  }

  async function updateStatus(record: ApiRecord, status: string) {
    const id = getRecordId(record);
    if (!id || !selected.endpoint) return;
    const path = selected.stageEndpoint ? `${selected.endpoint}/${id}/stage` : `${selected.endpoint}/${id}/status`;
    const body = selected.stageEndpoint ? { stage: status } : { status };
    const response = await fetch(`${apiBaseUrl}/${path}`, {
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json", ...sessionHeaders(session?.token, session?.user) },
      method: "PATCH",
    });
    if (!response.ok) {
      setToast(`Could not update ${selected.title} status.`);
      return;
    }
    await loadModule(selected);
  }

  async function logout() {
    if (session?.token) {
      await fetch(`${apiBaseUrl}/auth/logout`, { headers: sessionHeaders(session.token, session.user), method: "POST" }).catch(() => undefined);
    }
    window.localStorage.removeItem("tripos-crm-session");
    setSession(null);
    setRecords([]);
    setToast("Logged out.");
  }

  const rows = useMemo(() => records.map((record) => ({ record, row: recordToRow(record, selected) })), [records, selected]);
  const filteredRows = rows.filter(({ row }) => row.join(" ").toLowerCase().includes(query.toLowerCase()));
  const metrics = buildMetrics(records, dashboard);

  if (!authReady) return <div className="auth-screen"><section className="auth-card"><h1>TripOS</h1><p>Loading secure workspace...</p></section></div>;
  if (!session) return <LoginScreen onLogin={(nextSession) => { window.localStorage.setItem("tripos-crm-session", JSON.stringify(nextSession)); setSession(nextSession); setToast("Logged in."); }} />;

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => selectModule("dashboard")} type="button">
          <span className="brand-mark">T</span>
          <span><strong>TripOS</strong><small>Travel Operating System</small></span>
        </button>
        <nav aria-label="TripOS modules">
          {navGroups.map((group) => (
            <section className="nav-group" key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map((id) => {
                const module = modules.find((item) => item.id === id);
                if (!module) return null;
                return <button className={selectedId === id ? "selected" : ""} key={id} onClick={() => selectModule(id)} type="button"><span>{module.title}</span><em>{module.group}</em></button>;
              })}
            </section>
          ))}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div><span className="eyebrow">{String(session.tenant.name ?? "Tenant")} / {String(session.user.branchId ?? "Branch")}</span><h1>{selected.title}</h1></div>
          <div className="top-actions">
            <input aria-label="Search records" onChange={(event) => setQuery(event.target.value)} placeholder="Search live records" value={query} />
            <button onClick={() => void loadModule(selected, query)} type="button">Refresh</button>
            {selected.fields.length ? <button onClick={() => setModalOpen(true)} type="button">Create</button> : null}
            <button onClick={() => void logout()} type="button">Logout</button>
          </div>
        </header>

        <section className="hero-panel">
          <div><span className="eyebrow">{selected.group}</span><h2>{selected.id === "dashboard" ? "Live Control" : `${records.length} Records`}</h2><p>{selected.description}</p></div>
          <strong>{isLoading ? "Syncing" : "API-backed"}</strong>
        </section>

        <section className="kpi-grid" aria-label="TripOS metrics">
          {metrics.map(([label, value, helper]) => <article className="metric-card" key={label}><span>{label}</span><strong>{value}</strong><p>{helper}</p></article>)}
        </section>

        {selected.id === "invoices" ? <InvoiceBuilder onSaved={() => void loadModule(selected)} /> : null}
        {selected.id === "dashboard" ? <DashboardPanel dashboard={dashboard} /> : <RecordTable columns={selected.columns} filteredRows={filteredRows} module={selected} onSelect={setSelectedRecord} onStatus={updateStatus} />}

        <section className="quick-grid">
          <article><span className="eyebrow">Production Data</span><strong>Direct module APIs</strong><p>CRM records now load from dedicated TripOS endpoints instead of generic demo records.</p></article>
          <article><span className="eyebrow">B2B + Operations</span><strong>Inside admin CRM</strong><p>Agents, supplier ops, vouchers, payments, documents, and tickets stay in one back-office workspace.</p></article>
          <article><span className="eyebrow">Next Sync</span><strong>Mobile customer flows</strong><p>The same APIs can power B2C trip status, vouchers, documents, support, and payments in the app.</p></article>
        </section>

        {selectedRecord ? <DetailPanel module={selected} record={selectedRecord} onClose={() => setSelectedRecord(null)} /> : null}
        {modalOpen ? <RecordForm module={selected} onClose={() => setModalOpen(false)} onSubmit={createRecord} /> : null}
        <div className="toast" role="status">{toast}</div>
      </main>
    </div>
  );
}

function RecordTable({ columns, filteredRows, module, onSelect, onStatus }: { columns: string[]; filteredRows: { record: ApiRecord; row: string[] }[]; module: CrmModule; onSelect: (record: ApiRecord) => void; onStatus: (record: ApiRecord, status: string) => Promise<void>; }) {
  return (
    <section className="table-card">
      <div className="table-head"><div><span className="eyebrow">{module.title}</span><h2>Live Work Queue</h2></div><strong>{filteredRows.length} records</strong></div>
      <div className="table-wrap">
        <table>
          <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}<th>Action</th></tr></thead>
          <tbody>
            {filteredRows.map(({ record, row }) => (
              <tr key={getRecordId(record) || row.join("-")} onClick={() => onSelect(record)}>
                {row.map((cell, index) => <td key={`${cell}-${index}`}>{index === row.length - 1 ? renderCell(cell) : cell}</td>)}
                <td onClick={(event) => event.stopPropagation()}>{module.statusOptions ? <select value={String(record.stage ?? record.status ?? "")} onChange={(event) => void onStatus(record, event.target.value)}>{module.statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select> : <button type="button" onClick={() => onSelect(record)}>Open</button>}</td>
              </tr>
            ))}
            {!filteredRows.length ? <tr><td colSpan={columns.length + 1}>No API records found for this module.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function LoginScreen({ onLogin }: { onLogin: (session: CrmSession) => void }) {
  const [email, setEmail] = useState("admin@tripos.test");
  const [password, setPassword] = useState("TripOS@123");
  const [tenantCode, setTenantCode] = useState("WEBNZA");
  const [branchId, setBranchId] = useState("delhi");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        body: JSON.stringify({ email, password, tenantCode, branchId }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) throw new Error("Invalid login or API unavailable");
      onLogin((await response.json()) as CrmSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <section className="auth-card">
        <span className="brand-mark">T</span>
        <h1>TripOS Admin CRM</h1>
        <p>Multi-tenant travel CRM for agencies, DMC teams, branches, operations, finance, and B2B agents.</p>
        <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <label>Tenant Code<input value={tenantCode} onChange={(event) => setTenantCode(event.target.value)} /></label>
        <label>Branch<input value={branchId} onChange={(event) => setBranchId(event.target.value)} /></label>
        {error ? <div className="form-error">{error}</div> : null}
        <button disabled={loading} onClick={() => void login()} type="button">{loading ? "Signing in" : "Login"}</button>
      </section>
    </div>
  );
}

function DashboardPanel({ dashboard }: { dashboard: Record<string, unknown> | null }) {
  const modulesPayload = dashboard?.modules;
  const items = Array.isArray(modulesPayload) ? modulesPayload.slice(0, 8) as Record<string, unknown>[] : [];
  return (
    <section className="table-card">
      <div className="table-head"><div><span className="eyebrow">Dashboard</span><h2>Backend Module Readiness</h2></div><strong>{items.length || "Live"}</strong></div>
      <div className="module-grid">
        {modules.filter((item) => item.id !== "dashboard").map((item) => <article key={item.id}><strong>{item.title}</strong><span>{item.endpoint ? `/${item.endpoint}` : "workspace"}</span><p>{item.description}</p></article>)}
      </div>
    </section>
  );
}

function DetailPanel({ module, onClose, record }: { module: CrmModule; onClose: () => void; record: ApiRecord }) {
  return (
    <aside className="detail-panel">
      <button onClick={onClose} type="button">Close</button>
      <span className="eyebrow">{module.title}</span>
      <h2>{String(record[module.rowMap[0]] ?? record.title ?? record.name ?? getRecordId(record))}</h2>
      {module.rowMap.map((path, index) => <div className="detail-row" key={path}><span>{module.columns[index]}</span><strong>{String(path.split(".").reduce<unknown>((value, key) => value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined, record) ?? "-")}</strong></div>)}
    </aside>
  );
}

function RecordForm({ module, onClose, onSubmit }: { module: CrmModule; onClose: () => void; onSubmit: (values: Record<string, string>) => Promise<void>; }) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(module.fields.map((field) => [field.key, field.options?.[0] ?? ""])));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit() {
    setSaving(true);
    setError("");
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="modal-backdrop-layer" role="presentation">
      <section className="record-modal" role="dialog" aria-modal="true">
        <div className="record-modal-head"><div><span className="eyebrow">{module.group}</span><h3>Create {module.title}</h3></div><button onClick={onClose} type="button">Close</button></div>
        <div className="record-form-grid">
          {module.fields.map((field) => <FormField field={field} key={field.key} onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))} value={values[field.key] ?? ""} />)}
        </div>
        {error ? <div className="form-error">{error}</div> : null}
        <div className="record-modal-actions"><button onClick={onClose} type="button">Cancel</button><button disabled={saving || module.fields.some((field) => field.required && !values[field.key]?.trim())} onClick={() => void submit()} type="button">{saving ? "Saving" : "Save"}</button></div>
      </section>
    </div>
  );
}

function FormField({ field, onChange, value }: { field: ModuleField; onChange: (value: string) => void; value: string }) {
  return (
    <label className={field.type === "textarea" ? "formrow wide" : "formrow"}>
      <span>{field.label}{field.required ? " *" : ""}</span>
      {field.type === "select" ? <select onChange={(event) => onChange(event.target.value)} value={value}>{field.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select> : null}
      {field.type === "textarea" ? <textarea onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} value={value} /> : null}
      {!field.type || ["text", "number", "email", "date", "tags"].includes(field.type) ? <input onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder ?? (field.type === "tags" ? "Comma separated" : "")} type={field.type === "tags" ? "text" : field.type ?? "text"} value={value} /> : null}
    </label>
  );
}

function InvoiceBuilder({ onSaved }: { onSaved: () => void }) {
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [series, setSeries] = useState("TRV-");
  const [invoiceNo, setInvoiceNo] = useState("0001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [providerName, setProviderName] = useState("Webnza Travels");
  const [providerTaxNo, setProviderTaxNo] = useState("GSTIN-TRIPOS-DEMO");
  const [customerName, setCustomerName] = useState("Sharma Family");
  const [entries, setEntries] = useState([{ dateProvided: invoiceDate, description: "Dubai travel package", qty: 1, qtyType: "package", rate: 100000, total: 100000 }]);
  const [status, setStatus] = useState("Ready.");
  const preset = countryPresets[countryCode];
  const subtotal = entries.reduce((sum, entry) => sum + Number(entry.total || 0), 0);
  const taxAmount = subtotal * (preset.taxRate / 100);
  const totalPayable = subtotal + taxAmount;
  function updateEntry(index: number, field: keyof typeof entries[number], value: string) {
    setEntries((current) => current.map((entry, entryIndex) => {
      if (entryIndex !== index) return entry;
      const next = { ...entry, [field]: ["description", "qtyType", "dateProvided"].includes(field) ? value : Number(value) };
      if (field === "qty" || field === "rate") next.total = Number(next.qty || 0) * Number(next.rate || 0);
      return next;
    }));
  }
  async function generateNumber() {
    const response = await fetch(`${apiBaseUrl}/finance/invoices/next-number/${encodeURIComponent(series)}`);
    const result = (await response.json()) as { invoiceNo?: string };
    setInvoiceNo(result.invoiceNo ?? "0001");
  }
  async function saveInvoice() {
    const response = await fetch(`${apiBaseUrl}/finance/invoices`, {
      body: JSON.stringify({ invoiceSeries: series, invoiceNo, invoiceDate, countryCode, currencyCode: preset.currencyCode, currencySymbol: preset.currencySymbol, taxLabel: preset.taxLabel, taxRate: preset.taxRate, provider: { companyName: providerName, taxNo: providerTaxNo }, customer: { companyName: customerName }, entries, status: "draft" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    setStatus(response.ok ? "Invoice saved." : "Invoice save failed.");
    if (response.ok) onSaved();
  }
  return (
    <section className="invoice-builder">
      <div className="invoice-form-panel">
        <div className="table-head"><div><span className="eyebrow">Invoice Utility</span><h2>Country-aware travel invoice</h2></div><button onClick={generateNumber} type="button">Generate Number</button></div>
        <div className="invoice-form-grid">
          <label>Country<select value={countryCode} onChange={(event) => setCountryCode(event.target.value as CountryCode)}>{Object.entries(countryPresets).map(([code, item]) => <option key={code} value={code}>{item.country}</option>)}</select></label>
          <label>Series<input value={series} onChange={(event) => setSeries(event.target.value)} /></label>
          <label>Invoice No<input value={invoiceNo} onChange={(event) => setInvoiceNo(event.target.value)} /></label>
          <label>Date<input type="date" value={invoiceDate} onChange={(event) => setInvoiceDate(event.target.value)} /></label>
          <label>Provider<input value={providerName} onChange={(event) => setProviderName(event.target.value)} /></label>
          <label>Provider Tax No<input value={providerTaxNo} onChange={(event) => setProviderTaxNo(event.target.value)} /></label>
          <label>Customer<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} /></label>
        </div>
        <div className="table-wrap invoice-lines"><table><thead><tr><th>Date</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Total</th></tr></thead><tbody>{entries.map((entry, index) => <tr key={index}><td><input type="date" value={entry.dateProvided} onChange={(event) => updateEntry(index, "dateProvided", event.target.value)} /></td><td><input value={entry.description} onChange={(event) => updateEntry(index, "description", event.target.value)} /></td><td><input type="number" value={entry.qty} onChange={(event) => updateEntry(index, "qty", event.target.value)} /></td><td><input value={entry.qtyType} onChange={(event) => updateEntry(index, "qtyType", event.target.value)} /></td><td><input type="number" value={entry.rate} onChange={(event) => updateEntry(index, "rate", event.target.value)} /></td><td><input type="number" value={entry.total} onChange={(event) => updateEntry(index, "total", event.target.value)} /></td></tr>)}</tbody></table></div>
        <div className="action-bar"><button onClick={() => setEntries([...entries, { dateProvided: invoiceDate, description: "Additional service", qty: 1, qtyType: "unit", rate: 0, total: 0 }])} type="button">Add Line</button><button onClick={saveInvoice} type="button">Save Invoice</button><span>{status}</span></div>
      </div>
      <aside className="invoice-preview"><span className="eyebrow">{preset.country}</span><h2>{series}{invoiceNo}</h2><p>{providerName} to {customerName}</p><dl><div><dt>Subtotal</dt><dd>{preset.currencySymbol} {subtotal.toFixed(2)}</dd></div><div><dt>{preset.taxLabel} {preset.taxRate}%</dt><dd>{preset.currencySymbol} {taxAmount.toFixed(2)}</dd></div><div><dt>Total</dt><dd>{preset.currencySymbol} {totalPayable.toFixed(2)}</dd></div></dl></aside>
    </section>
  );
}

function buildMetrics(records: ApiRecord[], dashboard: Record<string, unknown> | null): [string, string, string][] {
  const dashboardTotal = typeof dashboard?.totalRecords === "number" ? String(dashboard.totalRecords) : "Live";
  return [["Records", String(records.length || dashboardTotal), "Current module"], ["API", "Dedicated", "No generic records"], ["Tenant", "Demo Org", "Branch scoped"], ["Status", "Ready", "Mongo-backed"]];
}

function renderCell(value: string) {
  const klass = statusClass(value);
  return klass === "neutral" ? value : <span className={`badge ${klass}`}>{value}</span>;
}
