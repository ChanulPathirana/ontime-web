"use client";

import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";

const SAVED_ROUTES = [
  { number: "882", name: "Colombo – Piliyandala", icon: "star" },
  { number: "138", name: "Fort – Maharagama",     icon: "star" },
];

const RECENT_TRIPS = [
  { from: "Central Station", to: "Market Square", date: "Today, 9:15 AM",   route: "882" },
  { from: "City Hall",        to: "University Jct.", date: "Yesterday, 5:40 PM", route: "138" },
  { from: "Market Square",   to: "Shopping Mall",  date: "Mon, 8:30 AM",    route: "120" },
];

export default function ProfilePage() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <TopAppBar title="Profile" />

        <div
          className="page-enter page-content-padded"
          style={{ maxWidth: "720px", margin: "0 auto" }}
        >
          {/* Avatar + name */}
          <div className="card-lg" style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: "white", fontVariationSettings: "'FILL' 1" }}>
                person
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-on-surface)", letterSpacing: "-0.01em" }}>Passenger</h2>
              <p style={{ color: "var(--color-on-surface-variant)", marginTop: "0.25rem", fontSize: "0.9375rem" }}>
                Colombo, Sri Lanka
              </p>
            </div>
            <button className="btn-secondary">
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</span>
              Edit
            </button>
          </div>

          {/* Saved routes */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
              Saved Routes
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {SAVED_ROUTES.map((r) => (
                <div key={r.number} className="card" style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "rgba(0,74,198,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-primary)", flexShrink: 0 }}>
                    {r.number}
                  </div>
                  <span style={{ flex: 1, fontWeight: 600, color: "var(--color-on-surface)" }}>{r.name}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#f59e0b", fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent trips */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
              Recent Trips
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {RECENT_TRIPS.map((t, i) => (
                <div key={i} className="card" style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-surface-container)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--color-on-surface-variant)" }}>directions_bus</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "var(--color-on-surface)", fontSize: "0.9375rem" }}>
                      {t.from} → {t.to}
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--color-on-surface-variant)", marginTop: "0.125rem" }}>
                      Route {t.route} · {t.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences placeholder */}
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
              Preferences
            </h3>
            <div className="card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {["Accessibility (low-floor buses)", "Notifications for saved routes", "Show delays on map"].map((pref) => (
                <div key={pref} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-on-surface)", fontWeight: 500 }}>{pref}</span>
                  <div style={{ width: 44, height: 24, borderRadius: "var(--radius-full)", background: "var(--color-primary)", position: "relative", cursor: "pointer" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, right: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
