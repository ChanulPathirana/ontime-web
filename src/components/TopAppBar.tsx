"use client";

import { useState } from "react";
import NotificationPanel from "./NotificationPanel";

interface TopAppBarProps {
  title?: string;
  showSearch?: boolean;
}

const UNREAD_COUNT = 4; // static initial badge count

export default function TopAppBar({
  title = "Transit Flow",
  showSearch = false,
}: TopAppBarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);

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
          <button className="icon-btn" aria-label="Refresh">
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
            {UNREAD_COUNT > 0 && !panelOpen && (
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
                {UNREAD_COUNT}
              </span>
            )}
          </button>

          <button className="icon-btn" aria-label="Account">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "22px" }}
            >
              account_circle
            </span>
          </button>
        </div>
      </header>

      {/* Notification slide-in panel */}
      <NotificationPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  );
}
