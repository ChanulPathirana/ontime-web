"use client";

import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";

interface Alert {
  id: string;
  type: "disruption" | "delay" | "info";
  route: string;
  title: string;
  body: string;
  time: string;
}

const ALERTS: Alert[] = [
  {
    id: "1",
    type: "disruption",
    route: "120",
    title: "Route 120 — Service Suspended",
    body: "Service suspended between Pettah and Wellawatte due to road works. Use route 138 as alternative.",
    time: "10 mins ago",
  },
  {
    id: "2",
    type: "delay",
    route: "882",
    title: "Route 882 — 15 min Delay",
    body: "All buses on the Colombo–Piliyandala route are running approximately 15 minutes late due to heavy traffic near Nugegoda junction.",
    time: "25 mins ago",
  },
  {
    id: "3",
    type: "info",
    route: "138",
    title: "Route 138 — Extra Service",
    body: "Additional buses added on the Fort–Maharagama route during peak hours (7–9 AM, 5–7 PM) until Friday.",
    time: "1 hour ago",
  },
  {
    id: "4",
    type: "info",
    route: "204",
    title: "Route 204 — Schedule Change",
    body: "The last departure from Borella has been moved from 10:30 PM to 10:00 PM effective from Monday.",
    time: "3 hours ago",
  },
  {
    id: "5",
    type: "delay",
    route: "882",
    title: "Route 882 — Back on Schedule",
    body: "Earlier delays on the Colombo–Piliyandala route have cleared. Buses are now running to schedule.",
    time: "Yesterday",
  },
];

const TYPE_STYLES: Record<Alert["type"], { bg: string; color: string; icon: string; label: string }> = {
  disruption: { bg: "#fee2e2", color: "#991b1b", icon: "warning",    label: "Disruption" },
  delay:      { bg: "#fef9c3", color: "#854d0e", icon: "schedule",   label: "Delay"      },
  info:       { bg: "#dbeafe", color: "#1e40af", icon: "info",       label: "Info"       },
};

export default function NotificationsPage() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <TopAppBar title="Service Alerts" />

        <div
          className="page-enter"
          style={{ paddingTop: "88px", paddingLeft: "2rem", paddingRight: "2rem", paddingBottom: "3rem", maxWidth: "800px", margin: "0 auto" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-on-surface)", letterSpacing: "-0.015em" }}>
                Service Alerts
              </h2>
              <p style={{ color: "var(--color-on-surface-variant)", marginTop: "0.25rem" }}>
                Live updates for routes in your area
              </p>
            </div>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "#16a34a" }}>
              <div className="live-dot" />
              Live
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {ALERTS.map((alert) => {
              const style = TYPE_STYLES[alert.type];
              return (
                <div
                  key={alert.id}
                  className="card"
                  style={{ padding: "1.25rem 1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: style.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px", color: style.color, fontVariationSettings: "'FILL' 1" }}>
                      {style.icon}
                    </span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: style.color, background: style.bg, padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                        {style.label}
                      </span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary)", background: "rgba(0,74,198,0.08)", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                        Route {alert.route}
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
