"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";
import { fetchLiveBuses, fetchRoutes, type ApiLiveBusResponse, type ApiRoute } from "@/services/api";

// ─── derived alert types ───────────────────────────────────────────────────

type AlertType = "incident" | "delay" | "inactive" | "info";

interface DerivedAlert {
  id: string;
  type: AlertType;
  routeNumber: string;
  routeName: string;
  routeDbId: string | null;
  title: string;
  body: string;
  time: string;
}

function relativeTime(iso: string | null): string {
  if (!iso) return "Just now";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function deriveAlerts(
  buses: ApiLiveBusResponse[],
  routeMap: Map<string, ApiRoute>,
): DerivedAlert[] {
  const alerts: DerivedAlert[] = [];

  buses.forEach((bus) => {
    const route = bus.route_id ? routeMap.get(String(bus.route_id)) : null;
    const routeNumber = route?.route_number ?? bus.route_id ?? "—";
    const routeName = route?.name ?? "Unknown Route";
    const routeDbId = bus.route_id ? String(bus.route_id) : null;

    if (bus.status === "breakdown" || bus.status === "incident") {
      alerts.push({
        id: `inc-${bus.id}`,
        type: "incident",
        routeNumber: String(routeNumber),
        routeName,
        routeDbId,
        title: `Route ${routeNumber} — Bus Breakdown`,
        body: `Bus ${bus.fleet_code ?? bus.id} (${bus.plate_number}) reported a breakdown. Service on this route may be disrupted.`,
        time: "Just now",
      });
    } else if (bus.status === "delayed") {
      alerts.push({
        id: `dly-${bus.id}`,
        type: "delay",
        routeNumber: String(routeNumber),
        routeName,
        routeDbId,
        title: `Route ${routeNumber} — Running Late`,
        body: `Bus ${bus.fleet_code ?? bus.id} on the ${routeName} route is currently delayed. Please expect longer wait times.`,
        time: "Just now",
      });
    } else if (bus.status === "inactive" || bus.status === "maintenance") {
      alerts.push({
        id: `off-${bus.id}`,
        type: "inactive",
        routeNumber: String(routeNumber),
        routeName,
        routeDbId,
        title: `Route ${routeNumber} — Reduced Service`,
        body: `Bus ${bus.fleet_code ?? bus.id} is currently offline (${bus.status}). Fewer buses may be running on this route.`,
        time: "Just now",
      });
    }
  });

  // If no issues detected, show a green status card per active route
  if (alerts.length === 0) {
    const seen = new Set<string>();
    buses.forEach((bus) => {
      if (bus.status !== "active" || !bus.route_id) return;
      const key = String(bus.route_id);
      if (seen.has(key)) return;
      seen.add(key);
      const route = routeMap.get(key);
      const routeNumber = route?.route_number ?? key;
      const routeName = route?.name ?? "Unknown Route";
      alerts.push({
        id: `ok-${key}`,
        type: "info",
        routeNumber: String(routeNumber),
        routeName,
        routeDbId: key,
        title: `Route ${routeNumber} — Operating Normally`,
        body: `${routeName} is running to schedule with no reported issues.`,
        time: "Just now",
      });
    });
  }

  return alerts;
}

const TYPE_META: Record<AlertType, { bg: string; color: string; icon: string; label: string }> = {
  incident: { bg: "#fee2e2", color: "#991b1b", icon: "warning",        label: "Incident" },
  delay:    { bg: "#fef9c3", color: "#854d0e", icon: "schedule",       label: "Delay"    },
  inactive: { bg: "#f3e8ff", color: "#6b21a8", icon: "do_not_disturb", label: "Offline"  },
  info:     { bg: "#dbeafe", color: "#1e40af", icon: "check_circle",   label: "Normal"   },
};

export default function NotificationsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<DerivedAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const [buses, routes] = await Promise.all([fetchLiveBuses(), fetchRoutes()]);
      const routeMap = new Map(routes.map((r) => [String(r.id), r]));
      setAlerts(deriveAlerts(buses, routeMap));
      setLastRefresh(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasIssues = alerts.some((a) => a.type !== "info");

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <TopAppBar title="Service Alerts" />

        <div
          className="page-enter"
          style={{
            paddingTop: "88px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            paddingBottom: "3rem",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-on-surface)", letterSpacing: "-0.015em" }}>
                Service Alerts
              </h2>
              <p style={{ color: "var(--color-on-surface-variant)", marginTop: "0.25rem" }}>
                {lastRefresh
                  ? `Updated ${relativeTime(lastRefresh.toISOString())}`
                  : "Loading live fleet data…"}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {!loading && (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: hasIssues ? "#dc2626" : "#16a34a" }}>
                  <div className="live-dot" style={{ background: hasIssues ? "#dc2626" : "#16a34a" }} />
                  {hasIssues ? "Issues detected" : "All clear"}
                </span>
              )}
              <button
                onClick={load}
                disabled={loading}
                style={{
                  display: "flex", alignItems: "center", gap: "0.375rem",
                  fontSize: "0.8125rem", fontWeight: 600,
                  color: "var(--color-primary)",
                  background: "rgba(0,74,198,0.08)",
                  border: "none", borderRadius: "var(--radius-full)",
                  padding: "6px 14px", cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
                Refresh
              </button>
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="card"
                  style={{ padding: "1.25rem 1.5rem", height: 96, opacity: 0.4 + i * 0.15 }}
                />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#dc2626", marginBottom: "0.75rem", display: "block" }}>
                cloud_off
              </span>
              <p style={{ fontWeight: 600, color: "var(--color-on-surface)", marginBottom: "0.5rem" }}>Could not reach the backend</p>
              <p style={{ fontSize: "0.875rem", color: "var(--color-on-surface-variant)", marginBottom: "1.25rem" }}>
                Make sure the backend is running and try again.
              </p>
              <button className="btn-primary" onClick={load}>Retry</button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && alerts.length === 0 && (
            <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--color-outline-variant)", marginBottom: "0.75rem", display: "block", fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <p style={{ fontWeight: 600, color: "var(--color-on-surface)" }}>No active buses found</p>
              <p style={{ fontSize: "0.875rem", color: "var(--color-on-surface-variant)", marginTop: "0.25rem" }}>
                There are no buses in service right now.
              </p>
            </div>
          )}

          {/* Alert cards */}
          {!loading && !error && alerts.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {alerts.map((alert) => {
                const meta = TYPE_META[alert.type];
                return (
                  <div
                    key={alert.id}
                    className="card"
                    style={{
                      padding: "1.25rem 1.5rem", display: "flex", gap: "1rem",
                      alignItems: "flex-start",
                      cursor: alert.routeDbId ? "pointer" : "default",
                    }}
                    onClick={() => {
                      if (alert.routeDbId) {
                        router.push(`/tracking?route=${alert.routeNumber}&routeDbId=${alert.routeDbId}`);
                      }
                    }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: meta.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "20px", color: meta.color, fontVariationSettings: "'FILL' 1" }}>
                        {meta.icon}
                      </span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: meta.color, background: meta.bg, padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                          {meta.label}
                        </span>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary)", background: "rgba(0,74,198,0.08)", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                          Route {alert.routeNumber}
                        </span>
                        <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--color-on-surface-variant)" }}>
                          {alert.time}
                        </span>
                      </div>
                      <h3 style={{ fontWeight: 700, color: "var(--color-on-surface)", marginBottom: "0.375rem" }}>
                        {alert.title}
                      </h3>
                      <p style={{ fontSize: "0.875rem", color: "var(--color-on-surface-variant)", lineHeight: 1.6 }}>
                        {alert.body}
                      </p>
                      {alert.routeDbId && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", marginTop: "0.625rem", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-primary)" }}>
                          Track this route
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
