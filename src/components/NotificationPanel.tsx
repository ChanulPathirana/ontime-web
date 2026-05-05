"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchLiveBuses, fetchRoutes, type ApiLiveBusResponse, type ApiRoute } from "@/services/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifCategory = "all" | "unread" | "delays" | "incidents";
type NotifType = "arrival" | "delay" | "incident" | "offline" | "ok";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
  routeNumber: string | null;
  routeDbId: string | null;
}

// ─── Icon config ──────────────────────────────────────────────────────────────

const NOTIF_ICON_CONFIG: Record<
  NotifType,
  { icon: string; iconColor: string; bgColor: string; accentBar: string }
> = {
  arrival: {
    icon: "directions_bus",
    iconColor: "var(--color-primary-container)",
    bgColor: "rgba(37, 99, 235, 0.10)",
    accentBar: "var(--color-primary-container)",
  },
  delay: {
    icon: "schedule",
    iconColor: "#854d0e",
    bgColor: "#fef9c3",
    accentBar: "#ca8a04",
  },
  incident: {
    icon: "warning",
    iconColor: "var(--color-error)",
    bgColor: "rgba(186, 26, 26, 0.10)",
    accentBar: "var(--color-error)",
  },
  offline: {
    icon: "do_not_disturb",
    iconColor: "#6b21a8",
    bgColor: "#f3e8ff",
    accentBar: "transparent",
  },
  ok: {
    icon: "check_circle",
    iconColor: "#15803d",
    bgColor: "#dcfce7",
    accentBar: "transparent",
  },
};

const FILTER_LABELS: { id: NotifCategory; label: string }[] = [
  { id: "all",       label: "All"       },
  { id: "unread",    label: "Unread"    },
  { id: "delays",    label: "Delays"    },
  { id: "incidents", label: "Incidents" },
];

// ─── Derive notifications from live bus data ──────────────────────────────────

function deriveNotifications(
  buses: ApiLiveBusResponse[],
  routeMap: Map<string, ApiRoute>,
): Notification[] {
  const items: Notification[] = [];

  buses.forEach((bus) => {
    const route = bus.route_id ? routeMap.get(String(bus.route_id)) : null;
    const routeNumber = String(route?.route_number ?? bus.route_id ?? "—");
    const routeName = route?.name ?? "Unknown Route";
    const routeDbId = bus.route_id ? String(bus.route_id) : null;
    const label = bus.fleet_code ?? String(bus.id);

    if (bus.status === "breakdown" || bus.status === "incident") {
      items.push({
        id: `inc-${bus.id}`,
        type: "incident",
        title: `Bus ${label} — Breakdown reported`,
        subtitle: `Route ${routeNumber} · ${routeName}`,
        time: "Just now",
        read: false,
        routeNumber,
        routeDbId,
      });
    } else if (bus.status === "delayed") {
      items.push({
        id: `dly-${bus.id}`,
        type: "delay",
        title: `Route ${routeNumber} running late`,
        subtitle: `Bus ${label} · ${routeName}`,
        time: "Just now",
        read: false,
        routeNumber,
        routeDbId,
      });
    } else if (bus.status === "inactive" || bus.status === "maintenance") {
      items.push({
        id: `off-${bus.id}`,
        type: "offline",
        title: `Bus ${label} offline (${bus.status})`,
        subtitle: `Route ${routeNumber} · ${routeName}`,
        time: "Just now",
        read: true,
        routeNumber,
        routeDbId,
      });
    } else if (bus.status === "active" && bus.route_id) {
      items.push({
        id: `ok-${bus.id}`,
        type: "ok",
        title: `Route ${routeNumber} operating normally`,
        subtitle: `Bus ${label} · ${routeName}`,
        time: "Just now",
        read: true,
        routeNumber,
        routeDbId,
      });
    }
  });

  return items.sort((a, b) => {
    const order: NotifType[] = ["incident", "delay", "offline", "ok", "arrival"];
    return order.indexOf(a.type) - order.indexOf(b.type);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
}

export default function NotificationPanel({
  open,
  onClose,
  onUnreadChange,
}: NotificationPanelProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<NotifCategory>("all");
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [buses, routes] = await Promise.all([fetchLiveBuses(), fetchRoutes()]);
      const routeMap = new Map(routes.map((r) => [String(r.id), r]));
      setNotifications(deriveNotifications(buses, routeMap));
      setLastFetch(Date.now());
    } catch {
      // keep previous state on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when panel opens (debounced: only if data is stale > 20s)
  useEffect(() => {
    if (open && Date.now() - lastFetch > 20_000) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Report unread count to parent badge
  useEffect(() => {
    onUnreadChange?.(notifications.filter((n) => !n.read).length);
  }, [notifications, onUnreadChange]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (activeFilter === "all")       return true;
    if (activeFilter === "unread")    return !n.read;
    if (activeFilter === "delays")    return n.type === "delay";
    if (activeFilter === "incidents") return n.type === "incident";
    return true;
  });

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const handleCardClick = (notif: Notification) => {
    markRead(notif.id);
    if (notif.routeDbId) {
      onClose();
      router.push(`/tracking?route=${notif.routeNumber}&routeDbId=${notif.routeDbId}`);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(25, 28, 29, 0.20)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          zIndex: 50,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Slide-in panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "380px",
          backgroundColor: "var(--color-surface-container-lowest)",
          zIndex: 60,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-24px 0 48px -12px rgba(0,0,0,0.10)",
          borderLeft: "1px solid rgba(195,198,215,0.3)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem 0",
            backgroundColor: "var(--color-surface-container-lowest)",
            borderBottom: "1px solid var(--color-surface-container-high)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-on-surface)", letterSpacing: "-0.02em" }}>
                Live Alerts
              </h2>
              {unreadCount > 0 && (
                <span style={{ backgroundColor: "rgba(37,99,235,0.10)", color: "var(--color-primary-container)", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.625rem", borderRadius: "var(--radius-full)" }}>
                  {unreadCount} New
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                onClick={load}
                disabled={loading}
                aria-label="Refresh alerts"
                style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-on-surface-variant)", opacity: loading ? 0.4 : 1 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>refresh</span>
              </button>
              <button
                onClick={onClose}
                aria-label="Close notifications"
                style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-on-surface-variant)" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {FILTER_LABELS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={{
                  paddingBottom: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: activeFilter === f.id ? 700 : 500,
                  color: activeFilter === f.id ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                  borderBottom: activeFilter === f.id ? "2px solid var(--color-primary)" : "2px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "var(--color-surface)",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {/* Skeleton while loading */}
          {loading && notifications.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ height: 72, borderRadius: "var(--radius-xl)", background: "var(--color-surface-container)", opacity: 0.4 + i * 0.15 }} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && notifications.length === 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1rem", gap: "0.75rem", color: "var(--color-on-surface-variant)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "48px", opacity: 0.35 }}>notifications_off</span>
              <p style={{ fontSize: "0.9375rem", fontWeight: 500, opacity: 0.6 }}>No buses in service</p>
              <button onClick={load} style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-primary)", marginTop: "0.5rem" }}>Retry</button>
            </div>
          )}

          {/* Mark all read */}
          {unreadCount > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "0.5rem", paddingBottom: "0.25rem" }}>
              <button onClick={markAllRead} style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-primary)" }}>
                Mark all as read
              </button>
            </div>
          )}

          {/* No results for filter */}
          {filtered.length === 0 && notifications.length > 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1rem", gap: "0.75rem", color: "var(--color-on-surface-variant)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "48px", opacity: 0.35 }}>filter_list_off</span>
              <p style={{ fontSize: "0.9375rem", fontWeight: 500, opacity: 0.6 }}>Nothing in this filter</p>
            </div>
          )}

          {/* Notification cards */}
          {filtered.map((notif) => {
            const cfg = NOTIF_ICON_CONFIG[notif.type];
            const isUnread = !notif.read;
            const isClickable = Boolean(notif.routeDbId);

            return (
              <div
                key={notif.id}
                onClick={() => handleCardClick(notif)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleCardClick(notif)}
                style={{
                  backgroundColor: "var(--color-surface-container-lowest)",
                  borderRadius: "var(--radius-xl)",
                  padding: "1rem",
                  boxShadow: isUnread ? "0 4px 12px -4px rgba(25,28,29,0.06)" : "none",
                  border: isUnread
                    ? `1px solid ${notif.type === "incident" ? "rgba(186,26,26,0.10)" : notif.type === "delay" ? "rgba(202,138,4,0.2)" : "rgba(37,99,235,0.10)"}`
                    : "1px solid rgba(195,198,215,0.40)",
                  position: "relative",
                  overflow: "hidden",
                  cursor: isClickable ? "pointer" : "default",
                  opacity: notif.read ? 0.78 : 1,
                  transition: "box-shadow 0.2s ease",
                }}
              >
                {isUnread && cfg.accentBar !== "transparent" && (
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", backgroundColor: cfg.accentBar, borderRadius: "var(--radius-xl) 0 0 var(--radius-xl)" }} />
                )}

                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", paddingLeft: isUnread && cfg.accentBar !== "transparent" ? "0.5rem" : 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: cfg.bgColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px", color: cfg.iconColor, fontVariationSettings: "'FILL' 1" }}>
                      {cfg.icon}
                    </span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.9375rem", fontWeight: isUnread ? 700 : 500, color: isUnread ? "var(--color-on-surface)" : "var(--color-on-surface-variant)", lineHeight: 1.35, marginBottom: "0.25rem" }}>
                      {notif.title}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: isUnread ? "var(--color-on-surface-variant)" : "var(--color-outline)" }}>
                      {notif.subtitle} · {notif.time}
                    </p>
                    {isClickable && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem", marginTop: "0.375rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-primary)" }}>
                        Track
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
                      </span>
                    )}
                  </div>

                  {isUnread && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--color-primary-container)", flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: "1rem 1.5rem", backgroundColor: "var(--color-surface-container-lowest)", borderTop: "1px solid var(--color-surface-container-high)" }}>
          <button
            onClick={() => { onClose(); router.push("/notifications"); }}
            style={{ width: "100%", backgroundColor: "var(--color-surface-container-high)", color: "var(--color-on-surface)", fontWeight: 700, fontSize: "0.9375rem", padding: "0.875rem", borderRadius: "var(--radius-lg)", transition: "background-color 0.2s ease" }}
          >
            View all alerts
          </button>
        </div>
      </aside>
    </>
  );
}
