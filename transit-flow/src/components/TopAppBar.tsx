"use client";

import { useState } from "react";

interface TopAppBarProps {
  title?: string;
  showSearch?: boolean;
}

export default function TopAppBar({
  title = "Transit Flow",
  showSearch = false,
}: TopAppBarProps) {
  const [searchValue, setSearchValue] = useState("");

  return (
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
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
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

      <div className="top-bar-actions">
        <button className="icon-btn" aria-label="Refresh">
          <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
            sync
          </span>
        </button>
        <button className="icon-btn" aria-label="Notifications" style={{ position: "relative" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
            notifications
          </span>
          <span
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "var(--color-primary)",
            }}
          />
        </button>
        <button className="icon-btn" aria-label="Account">
          <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
            account_circle
          </span>
        </button>
      </div>
    </header>
  );
}
