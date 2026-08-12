"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBuilding,
  faCodeBranch,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import type { ApiRecord } from "./crmTypes";
import {
  buildMetrics,
  buildNotificationCount,
  exportRecords,
  formatDisplayValue,
  recordToRow,
} from "./crmUtils";
import { modules, navGroups } from "../modules";
import { SessionProvider, useSession } from "../lib/session";
import { useModuleData } from "../hooks/useModuleData";
import { useModuleMutations } from "../hooks/useModuleMutations";
import RecordTable from "./RecordTable";
import DetailPanel from "./DetailPanel";
import RecordForm from "./RecordForm";
import InvoiceBuilder from "./InvoiceBuilder";
import LoginScreen from "./LoginScreen";
import DashboardPanel from "./DashboardPanel";
import ThemeSwitcher, { type CrmTheme } from "./ThemeSwitcher";

const organizationOptions = [
  { value: "WEBNZA", label: "Webnza Travel Group" },
  { value: "TRIPOS", label: "TripOS Demo Company" },
  { value: "DMC", label: "DMC Operations" },
];
const branchOptions = [
  { value: "delhi", label: "Delhi Branch" },
  { value: "mumbai", label: "Mumbai Branch" },
  { value: "dubai", label: "Dubai Branch" },
  { value: "remote", label: "Remote Team" },
];

export default function CrmShell() {
  return (
    <SessionProvider>
      <CrmShellContent />
    </SessionProvider>
  );
}

function CrmShellContent() {
  const router = useRouter();
  const pathname = usePathname();
  const pathModule = pathname.split("/").filter(Boolean)[0];
  const initialModule = modules.some((item) => item.id === pathModule)
    ? pathModule
    : "dashboard";
  const [selectedId, setSelectedId] = useState(initialModule);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [toast, setToast] = useState(
    "TripOS CRM connected to production APIs.",
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ApiRecord | null>(null);
  const [theme, setTheme] = useState<CrmTheme>("system");
  const activeNavItemRef = useRef<HTMLButtonElement | null>(null);
  const selected = modules.find((item) => item.id === selectedId) ?? modules[0];
  const { session, authReady, login, logout, updateWorkspace } = useSession();

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("tripos-crm-theme");
    if (
      storedTheme === "system" ||
      storedTheme === "light" ||
      storedTheme === "dark"
    ) {
      setTheme(storedTheme);
    }
  }, []);

  function changeTheme(nextTheme: CrmTheme) {
    setTheme(nextTheme);
    window.localStorage.setItem("tripos-crm-theme", nextTheme);
  }

  useEffect(() => {
    if (pathModule && modules.some((item) => item.id === pathModule))
      setSelectedId(pathModule);
  }, [pathModule]);

  useEffect(() => {
    window.setTimeout(() => {
      activeNavItemRef.current?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
      activeNavItemRef.current?.focus({ preventScroll: true });
    }, 60);
  }, [selectedId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query), 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const { records, dashboard, isLoading, refetch } = useModuleData(
    selected,
    debouncedQuery,
    setToast,
  );

  const { createRecord, updateStatus, importRecords } = useModuleMutations(
    selected,
    setToast,
  );

  function selectModule(id: string) {
    setSelectedId(id);
    router.push(id === "dashboard" ? "/" : `/${id}`);
  }

  async function handleWorkspaceChange(
    field: "organizationCode" | "branchId",
    value: string,
  ) {
    try {
      await updateWorkspace(field, value);
      setToast("Workspace context updated.");
      await refetch();
    } catch {
      setToast("Workspace access denied.");
    }
  }

  async function handleLogout() {
    await logout();
    setToast("Logged out.");
  }

  const rows = useMemo(
    () =>
      records.map((record) => ({
        record,
        row: recordToRow(record, selected),
      })),
    [records, selected],
  );
  const filteredRows = rows.filter(({ row }) =>
    row.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  const metrics = buildMetrics(records, dashboard);
  const notificationCount = buildNotificationCount(dashboard, records);

  if (!authReady)
    return (
      <div className={`auth-screen theme-${theme}`}>
        <section className="auth-card">
          <h1>TripOS</h1>
          <p>Loading secure workspace...</p>
        </section>
      </div>
    );
  if (!session)
    return (
      <LoginScreen
        theme={theme}
        onLogin={(nextSession) => {
          login(nextSession);
          setToast("Logged in.");
        }}
      />
    );

  return (
    <div className={`admin-shell theme-${theme}`}>
      <aside className="sidebar">
        <div className="sidebar-head">
          <button
            className="brand"
            onClick={() => selectModule("dashboard")}
            type="button"
          >
            <span className="brand-mark">T</span>
            <span>
              <strong>TripOS</strong>
              <small>Travel Operating System</small>
            </span>
          </button>
          <span className="sidebar-status">Live CRM</span>
        </div>
        <nav className="main-menu" aria-label="TripOS modules">
          {navGroups.map((group) => (
            <section className="nav-group" key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map((id) => {
                const navModule = modules.find((item) => item.id === id);
                if (!navModule) return null;
                return (
                  <button
                    className={selectedId === id ? "selected" : ""}
                    key={id}
                    onClick={() => selectModule(id)}
                    ref={selectedId === id ? activeNavItemRef : undefined}
                    type="button"
                  >
                    <span>{navModule.title}</span>
                  </button>
                );
              })}
            </section>
          ))}
        </nav>
      </aside>

      <section className="right-sec">
        <header className="topbar">
          <div className="topbar-title">
            <strong>TripOS Admin CRM</strong>
            <small>
              {String(session.organization.name ?? "Organization Workspace")}
            </small>
          </div>
          <div className="top-actions">
            <div className="header-workspace" aria-label="Workspace context">
              <label>
                <FontAwesomeIcon aria-hidden icon={faBuilding} />
                <select
                  aria-label="Organization"
                  onChange={(event) =>
                    void handleWorkspaceChange(
                      "organizationCode",
                      event.target.value,
                    )
                  }
                  value={String(
                    session.organization.code ??
                      session.user.organizationCode ??
                      "WEBNZA",
                  )}
                >
                  {organizationOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <FontAwesomeIcon aria-hidden icon={faCodeBranch} />
                <select
                  aria-label="Branch"
                  onChange={(event) =>
                    void handleWorkspaceChange("branchId", event.target.value)
                  }
                  value={String(session.user.branchId ?? "delhi")}
                >
                  {branchOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <ThemeSwitcher onChange={changeTheme} selectedTheme={theme} />
            <div className="profile-chip">
              <span>{String(session.user.name ?? "Admin").slice(0, 1)}</span>
              <div>
                <strong>{String(session.user.name ?? "TripOS Admin")}</strong>
                <small>
                  {formatDisplayValue(
                    String(session.user.role ?? "organization_admin"),
                  )}
                </small>
              </div>
            </div>
            <button
              aria-label={`${notificationCount} notifications`}
              className="icon-action notification-action"
              onClick={() => selectModule("notifications")}
              title="Notifications"
              type="button"
            >
              <FontAwesomeIcon aria-hidden icon={faBell} />
              {notificationCount ? <span>{notificationCount}</span> : null}
            </button>
            <button
              className="logout-action"
              onClick={() => void handleLogout()}
              type="button"
            >
              <FontAwesomeIcon aria-hidden icon={faRightFromBracket} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="workspace">
          <nav className="workspace-breadcrumb" aria-label="Current location">
            <span>TripOS Admin CRM</span>
            <span>{selected.group}</span>
            <strong>{selected.title}</strong>
          </nav>

          <section className="hero-panel">
            <div>
              <span className="eyebrow">{selected.group}</span>
              <h2>
                {selected.id === "dashboard" ? "Live Dashboard" : "Workspace"}
              </h2>
              <p>{selected.description}</p>
            </div>
            <strong aria-busy={isLoading}>API Ready</strong>
          </section>

          <section className="kpi-grid" aria-label="TripOS metrics">
            {metrics.map(([label, value, helper]) => (
              <article className="metric-card" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <p>{helper}</p>
              </article>
            ))}
          </section>

          {selected.id === "invoices" ? (
            <InvoiceBuilder onSaved={() => void refetch()} />
          ) : null}
          {selected.id === "dashboard" ? (
            <DashboardPanel dashboard={dashboard} />
          ) : (
            <RecordTable
              columns={selected.columns}
              filteredRows={filteredRows}
              isLoading={isLoading}
              module={selected}
              onCreate={() => setModalOpen(true)}
              onExport={(format) =>
                exportRecords(
                  selected.title,
                  selected.columns,
                  filteredRows,
                  format,
                )
              }
              onImport={(file) =>
                void importRecords.mutateAsync(file).catch(() => undefined)
              }
              onRefresh={() => void refetch()}
              onSelect={setSelectedRecord}
              onStatus={(record, status) =>
                updateStatus
                  .mutateAsync({ record, status })
                  .catch(() => undefined)
              }
              query={query}
              setQuery={setQuery}
            />
          )}

          <section className="quick-grid">
            <article>
              <span className="eyebrow">Production Data</span>
              <strong>Direct module APIs</strong>
              <p>
                CRM records now load from dedicated TripOS endpoints instead of
                generic demo records.
              </p>
            </article>
            <article>
              <span className="eyebrow">B2B + Operations</span>
              <strong>Inside admin CRM</strong>
              <p>
                Agents, supplier ops, vouchers, payments, documents, and tickets
                stay in one back-office workspace.
              </p>
            </article>
            <article>
              <span className="eyebrow">Next Sync</span>
              <strong>Mobile customer flows</strong>
              <p>
                The same APIs can power B2C trip status, vouchers, documents,
                support, and payments in the app.
              </p>
            </article>
          </section>

          {selectedRecord ? (
            <DetailPanel
              module={selected}
              record={selectedRecord}
              onClose={() => setSelectedRecord(null)}
            />
          ) : null}
          {modalOpen ? (
            <RecordForm
              module={selected}
              onClose={() => setModalOpen(false)}
              onSubmit={async (values) => {
                await createRecord.mutateAsync(values);
                setModalOpen(false);
              }}
            />
          ) : null}
          <div className="toast" role="status">
            {toast}
          </div>
        </main>
      </section>
    </div>
  );
}
