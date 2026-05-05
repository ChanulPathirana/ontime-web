"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NotificationPanel from "./NotificationPanel";

interface TopAppBarProps {
  title?: string;
  showSearch?: boolean;
  unreadCount?: number;
  onUnreadChange?: (count: number) => void;
}

export default function TopAppBar({
  title = "Transit Flow",
  showSearch = false,
}: TopAppBarProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  function handleRefresh() {
    router.refresh();
    window.location.reload();
  }

  return (
    <>
      <header className="top-app-bar">
        {showSearch ? (
          <div style={{ flex: 1, maxWidth: "32rem" }}>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                height: "40px",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--color-surface-container-highest)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "48px",
                  display: "grid",
                  placeItems: "center",
                  color: "#94a3b8",
                  flexShrink: 0,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  search
                </span>
              </div>
              <input
                type="text"
                placeholder="Search routes..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{
                  height: "100%",
                  flex: 1,
                  background: "transparent",
                  fontSize: "0.875rem",
                  color: "var(--color-on-surface)",
                  paddingRight: "0.75rem",
                }}
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            {title}
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="top-bar-actions">
          <button className="icon-btn" aria-label="Refresh" onClick={handleRefresh}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "22px" }}
            >
              sync
            </span>
          </button>

          {/* Bell — toggles NotificationPanel */}
          <button
            className="icon-btn"
            aria-label="Notifications"
            aria-expanded={panelOpen}
            onClick={() => setPanelOpen((v) => !v)}
            style={{
              position: "relative",
              color: panelOpen ? "var(--color-primary)" : undefined,
              backgroundColor: panelOpen
                ? "rgba(37, 99, 235, 0.08)"
                : undefined,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "22px",
                fontVariationSettings: panelOpen ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              notifications
            </span>
            {/* Unread badge — hides when panel is open */}
            {unreadCount > 0 && !panelOpen && (
              <span
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "4px",
                  minWidth: "16px",
                  height: "16px",
                  backgroundColor: "var(--color-primary)",
                  color: "#fff",
                  fontSize: "0.625rem",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--radius-full)",
                  padding: "0 3px",
                  lineHeight: 1,
                  boxShadow: "0 0 0 2px #fff",
                  pointerEvents: "none",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* Notification slide-in panel */}
      <NotificationPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onUnreadChange={setUnreadCount}
      />
    </>
  );
}
