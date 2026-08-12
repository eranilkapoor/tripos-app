"use client";

import { formatDisplayValue } from "./crmUtils";

export default function DashboardPanel({
  dashboard,
}: {
  dashboard: Record<string, unknown> | null;
}) {
  const counters =
    dashboard?.counters && typeof dashboard.counters === "object"
      ? (dashboard.counters as Record<string, unknown>)
      : {};
  const pipeline = Array.isArray(dashboard?.pipeline)
    ? (dashboard.pipeline as Record<string, unknown>[])
    : [];
  const recentActivity = Array.isArray(dashboard?.recentActivity)
    ? (dashboard.recentActivity as Record<string, unknown>[])
    : [];
  return (
    <section className="table-card">
      <div className="table-head">
        <div>
          <span className="eyebrow">Live Dashboard API</span>
          <h2>{String(dashboard?.organization ?? "TripOS Workspace")}</h2>
        </div>
        <strong>{String(dashboard?.branch ?? "All Branches")}</strong>
      </div>
      <div className="dashboard-live-grid">
        {Object.entries(counters).map(([key, value]) => (
          <article key={key}>
            <span>{formatDisplayValue(key)}</span>
            <strong>{String(value ?? 0)}</strong>
          </article>
        ))}
      </div>
      <div className="dashboard-split">
        <section>
          <h3>Pipeline</h3>
          {pipeline.map((item, index) => (
            <div className="dashboard-row" key={`${item.stage}-${index}`}>
              <span>{String(item.stage ?? "Stage")}</span>
              <strong>{String(item.count ?? 0)}</strong>
            </div>
          ))}
        </section>
        <section>
          <h3>Recent Activity</h3>
          {recentActivity.length ? (
            recentActivity.map((item, index) => (
              <div className="dashboard-row" key={`${item.id}-${index}`}>
                <span>
                  {formatDisplayValue(String(item.action ?? "Activity"))}
                </span>
                <strong>{String(item.method ?? "-")}</strong>
              </div>
            ))
          ) : (
            <div className="dashboard-row">
              <span>No recent activity</span>
              <strong>Live</strong>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
