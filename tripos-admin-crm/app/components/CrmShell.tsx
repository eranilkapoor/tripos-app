"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBuilding,
  faCodeBranch,
  faGear,
  faKey,
  faUser,
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
import AccountPanel from "./AccountPanel";

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
  const [editingRecord, setEditingRecord] = useState<ApiRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ApiRecord | null>(null);
  const [theme, setTheme] = useState<CrmTheme>("light");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const activeNavItemRef = useRef<HTMLButtonElement | null>(null);
  const selected = modules.find((item) => item.id === selectedId) ?? modules[0];
  const { session, authReady, login, logout, updateWorkspace } = useSession();

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("tripos-crm-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
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

  const { createRecord, updateRecord, updateStatus, importRecords } =
    useModuleMutations(selected, setToast);

  function selectModule(id: string) {
    setProfileMenuOpen(false);
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
  const isPlatformUser = session?.user.role === "platform_admin";
  const userBranchIds = Array.isArray(session?.user.branchIds)
    ? session.user.branchIds.map((branchId) => String(branchId))
    : [];
  const availableBranchOptions = (
    userBranchIds.length
      ? userBranchIds.map((branchId) => ({
          value: branchId,
          label:
            branchOptions.find((item) => item.value === branchId)?.label ??
            formatDisplayValue(branchId),
        }))
      : branchOptions
  ).filter(
    (item, index, items) =>
      items.findIndex((candidate) => candidate.value === item.value) === index,
  );

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
            <strong>
              {selected.id === "dashboard" ? "Live Dashboard" : selected.title}
            </strong>
            <small>
              {selected.group} /{" "}
              {String(session.organization.name ?? "Organization Workspace")}
            </small>
          </div>
          <div className="top-actions" role="toolbar" aria-label="CRM actions">
            <div className="header-workspace" aria-label="Workspace context">
              {isPlatformUser ? (
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
              ) : (
                <span className="workspace-chip">
                  <FontAwesomeIcon aria-hidden icon={faBuilding} />
                  {String(session.organization.name ?? "Organization")}
                </span>
              )}
              <label>
                <FontAwesomeIcon aria-hidden icon={faCodeBranch} />
                <select
                  aria-label="Branch"
                  onChange={(event) =>
                    void handleWorkspaceChange("branchId", event.target.value)
                  }
                  value={String(session.user.branchId ?? "delhi")}
                >
                  {availableBranchOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <ThemeSwitcher onChange={changeTheme} selectedTheme={theme} />
            <button
              aria-label={`${notificationCount} notifications`}
              className="topbar-icon-button notification-action"
              onClick={() => selectModule("notifications")}
              title="Notifications"
              type="button"
            >
              <FontAwesomeIcon aria-hidden icon={faBell} />
              {notificationCount ? <span>{notificationCount}</span> : null}
            </button>
            <div className="profile-menu">
              <button
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                className="profile-menu-trigger"
                onClick={() => setProfileMenuOpen((current) => !current)}
                type="button"
              >
                <span className="profile-avatar">
                  {String(session.user.name ?? "Admin").slice(0, 1)}
                </span>
                <span className="profile-name">
                  {String(session.user.name ?? "TripOS Admin")}
                </span>
              </button>
              {profileMenuOpen ? (
                <div className="profile-menu-dropdown" role="menu">
                  <button
                    onClick={() => selectModule("my-profile")}
                    type="button"
                  >
                    <FontAwesomeIcon aria-hidden icon={faUser} />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => selectModule("change-password")}
                    type="button"
                  >
                    <FontAwesomeIcon aria-hidden icon={faKey} />
                    <span>Change Password</span>
                  </button>
                  <button
                    onClick={() => selectModule("settings")}
                    type="button"
                  >
                    <FontAwesomeIcon aria-hidden icon={faGear} />
                    <span>Settings</span>
                  </button>
                  <button onClick={() => void handleLogout()} type="button">
                    <FontAwesomeIcon aria-hidden icon={faRightFromBracket} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : null}
            </div>
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

          {selected.id === "my-profile" ? (
            <AccountPanel mode="profile" onNotify={setToast} />
          ) : null}
          {selected.id === "change-password" ? (
            <AccountPanel mode="password" onNotify={setToast} />
          ) : null}
          {selected.id === "invoices" ? (
            <InvoiceBuilder onSaved={() => void refetch()} />
          ) : null}
          {selected.id === "dashboard" ? (
            <DashboardPanel dashboard={dashboard} />
          ) : selected.id === "my-profile" ||
            selected.id === "change-password" ? null : (
            <RecordTable
              columns={selected.columns}
              filteredRows={filteredRows}
              isLoading={isLoading}
              module={selected}
              onCreate={() => {
                setEditingRecord(null);
                setModalOpen(true);
              }}
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

          {selected.id === "dashboard" ? (
            <section className="quick-grid">
              <article>
                <span className="eyebrow">Production Data</span>
                <strong>Direct module APIs</strong>
                <p>
                  CRM records now load from dedicated TripOS endpoints instead
                  of generic demo records.
                </p>
              </article>
              <article>
                <span className="eyebrow">B2B + Operations</span>
                <strong>Inside admin CRM</strong>
                <p>
                  Agents, supplier ops, vouchers, payments, documents, and
                  tickets stay in one back-office workspace.
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
          ) : null}

          {selectedRecord ? (
            <DetailPanel
              module={selected}
              record={selectedRecord}
              onClose={() => setSelectedRecord(null)}
              onEdit={() => {
                setEditingRecord(selectedRecord);
                setModalOpen(true);
              }}
            />
          ) : null}
          {modalOpen ? (
            <RecordForm
              initialRecord={editingRecord}
              module={selected}
              onClose={() => {
                setModalOpen(false);
                setEditingRecord(null);
              }}
              onSubmit={async (values) => {
                if (editingRecord) {
                  await updateRecord.mutateAsync({
                    record: editingRecord,
                    values,
                  });
                } else {
                  await createRecord.mutateAsync(values);
                }
                setModalOpen(false);
                setEditingRecord(null);
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
