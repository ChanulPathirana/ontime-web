"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifCategory = "all" | "unread" | "delays" | "updates";

type NotifType = "arrival" | "delay" | "update" | "dispatch" | "success";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "arrival",
    title: "Bus 120 arriving in 5 minutes",
    subtitle: "Central Station",
    time: "2 mins ago",
    read: false,
  },
  {
    id: "2",
    type: "delay",
    title: "Bus 138 delayed by 10 minutes",
    subtitle: "North Route",
    time: "15 mins ago",
    read: false,
  },
  {
    id: "3",
    type: "update",
    title: "Route 101 has been updated",
    subtitle: "System Update",
    time: "1 hr ago",
    read: true,
  },
  {
    id: "4",
    type: "dispatch",
    title: "Your bus is now active on road",
    subtitle: "Dispatch",
    time: "2 hrs ago",
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "Trip completed successfully",
    subtitle: "System Log",
    time: "3 hrs ago",
    read: true,
  },
];

// ─── Icon config per notification type ────────────────────────────────────────

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
    icon: "warning",
    iconColor: "var(--color-error)",
    bgColor: "rgba(186, 26, 26, 0.10)",
    accentBar: "var(--color-error)",
  },
  update: {
    icon: "route",
    iconColor: "var(--color-on-secondary-container)",
    bgColor: "rgba(172, 191, 255, 0.30)",
    accentBar: "transparent",
  },
  dispatch: {
    icon: "directions_bus",
    iconColor: "#15803d",
    bgColor: "#dcfce7",
    accentBar: "transparent",
  },
  success: {
    icon: "check_circle",
    iconColor: "#15803d",
    bgColor: "#dcfce7",
    accentBar: "transparent",
  },
};

const FILTER_LABELS: { id: NotifCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "delays", label: "Delays" },
  { id: "updates", label: "Updates" },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationPanel({
  open,
  onClose,
}: NotificationPanelProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<NotifCategory>("all");
  const [notifEnabled, setNotifEnabled] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Derived list based on active filter ─────────────────────────
  const filtered = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !n.read;
    if (activeFilter === "delays") return n.type === "delay";
    if (activeFilter === "updates") return n.type === "update" || n.type === "success";
    return true;
  });

  // ── Actions ──────────────────────────────────────────────────────
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () => setNotifications([]);

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
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
        aria-hidden="true"
      />

      {/* Slide-in Panel */}
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
          boxShadow: "-24px 0 48px -12px rgba(0, 0, 0, 0.10)",
          borderLeft: "1px solid rgba(195, 198, 215, 0.3)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
        }}
      >
        {/* ── Panel Header ───────────────────────────────────────── */}
        <div
          style={{
            padding: "1.25rem 1.5rem 0",
            backgroundColor: "var(--color-surface-container-lowest)",
            zIndex: 10,
            borderBottom: "1px solid var(--color-surface-container-high)",
          }}
        >
          {/* Title row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "var(--color-on-surface)",
                  letterSpacing: "-0.02em",
                }}
              >
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span
                  style={{
                    backgroundColor: "rgba(37, 99, 235, 0.10)",
                    color: "var(--color-primary-container)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.625rem",
                    borderRadius: "var(--radius-full)",
                  }}
                >
                  {unreadCount} Unread
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              aria-label="Close notifications"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-on-surface-variant)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-surface-container-low)";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--color-on-surface)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--color-on-surface-variant)";
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                close
              </span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {FILTER_LABELS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={{
                  paddingBottom: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: activeFilter === f.id ? 700 : 500,
                  color:
                    activeFilter === f.id
                      ? "var(--color-primary)"
                      : "var(--color-on-surface-variant)",
                  borderBottom:
                    activeFilter === f.id
                      ? "2px solid var(--color-primary)"
                      : "2px solid transparent",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.01em",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Notification List ──────────────────────────────────── */}
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
          {/* Mark all read row */}
          {unreadCount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: "0.5rem",
                paddingBottom: "0.25rem",
              }}
            >
              <button
                onClick={markAllRead}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--color-primary)",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = "0.7")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
                }
              >
                Mark all as read
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "3rem 1rem",
                gap: "0.75rem",
                color: "var(--color-on-surface-variant)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "48px", opacity: 0.35 }}
              >
                notifications_off
              </span>
              <p style={{ fontSize: "0.9375rem", fontWeight: 500, opacity: 0.6 }}>
                No notifications here
              </p>
            </div>
          )}

          {filtered.map((notif) => {
            const cfg = NOTIF_ICON_CONFIG[notif.type];
            const isUnread = !notif.read;

            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && markRead(notif.id)}
                style={{
                  backgroundColor: "var(--color-surface-container-lowest)",
                  borderRadius: "var(--radius-xl)",
                  padding: "1rem",
                  boxShadow: isUnread
                    ? "0 4px 12px -4px rgba(25, 28, 29, 0.06)"
                    : "none",
                  border: isUnread
                    ? `1px solid ${
                        notif.type === "delay"
                          ? "rgba(186,26,26,0.10)"
                          : "rgba(37,99,235,0.10)"
                      }`
                    : "1px solid rgba(195,198,215,0.40)",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s ease, background-color 0.2s ease",
                  opacity: notif.read ? 0.78 : 1,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 8px 24px -8px rgba(25, 28, 29, 0.10)";
                  if (notif.read)
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "var(--color-surface-container-low)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = isUnread
                    ? "0 4px 12px -4px rgba(25, 28, 29, 0.06)"
                    : "none";
                  (e.currentTarget as HTMLDivElement).style.backgroundColor =
                    "var(--color-surface-container-lowest)";
                }}
              >
                {/* Left accent bar (unread only) */}
                {isUnread && cfg.accentBar !== "transparent" && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "4px",
                      backgroundColor: cfg.accentBar,
                      borderRadius: "var(--radius-xl) 0 0 var(--radius-xl)",
                    }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    paddingLeft: isUnread && cfg.accentBar !== "transparent" ? "0.5rem" : 0,
                  }}
                >
                  {/* Icon bubble */}
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: cfg.bgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      className="material-symbols-outlined filled"
                      style={{
                        fontSize: "20px",
                        color: cfg.iconColor,
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      {cfg.icon}
                    </span>
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: isUnread ? 700 : 500,
                        color: isUnread
                          ? "var(--color-on-surface)"
                          : "var(--color-on-surface-variant)",
                        lineHeight: 1.35,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {notif.title}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: isUnread
                          ? "var(--color-on-surface-variant)"
                          : "var(--color-outline)",
                      }}
                    >
                      {notif.subtitle} • {notif.time}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {isUnread && (
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "var(--color-primary-container)",
                        flexShrink: 0,
                        marginTop: "4px",
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Panel Footer ───────────────────────────────────────── */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            backgroundColor: "var(--color-surface-container-lowest)",
            borderTop: "1px solid var(--color-surface-container-high)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Toggle row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--color-on-surface)",
              }}
            >
              Toggle Notifications
            </span>

            {/* Custom Toggle Switch */}
            <button
              role="switch"
              aria-checked={notifEnabled}
              onClick={() => setNotifEnabled((v) => !v)}
              style={{
                position: "relative",
                width: "44px",
                height: "24px",
                borderRadius: "var(--radius-full)",
                backgroundColor: notifEnabled
                  ? "var(--color-primary-container)"
                  : "var(--color-surface-container-highest)",
                transition: "background-color 0.25s ease",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "3px",
                  left: notifEnabled ? "calc(100% - 21px)" : "3px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                  transition: "left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            </button>
          </div>

          {/* Clear All button */}
          <button
            onClick={clearAll}
            style={{
              width: "100%",
              backgroundColor: "var(--color-surface-container-high)",
              color: "var(--color-on-surface)",
              fontWeight: 700,
              fontSize: "0.9375rem",
              padding: "0.875rem",
              borderRadius: "var(--radius-lg)",
              transition: "background-color 0.2s ease",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-surface-container)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-surface-container-high)")
            }
          >
            Clear All
          </button>
        </div>
      </aside>
    </>
  );
}
