import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";

interface BusRoute {
  id: string;
  number: string;
  name: string;
  status: "active" | "delayed";
  eta: string;
  etaColor: string;
  type: string;
}

const BUS_ROUTES: BusRoute[] = [
  {
    id: "1",
    number: "882",
    name: "Colombo - Piliyandala",
    status: "active",
    eta: "4 mins",
    etaColor: "var(--color-primary)",
    type: "Standard AC",
  },
  {
    id: "2",
    number: "120",
    name: "Pettah - Kesbewa",
    status: "delayed",
    eta: "12 mins",
    etaColor: "var(--color-error)",
    type: "Express",
  },
  {
    id: "3",
    number: "138",
    name: "Fort - Maharagama",
    status: "active",
    eta: "7 mins",
    etaColor: "var(--color-primary)",
    type: "Regular",
  },
  {
    id: "4",
    number: "204",
    name: "Borella - Panadura",
    status: "active",
    eta: "9 mins",
    etaColor: "var(--color-primary)",
    type: "Semi-Express",
  },
];

const SORT_OPTIONS = ["Shortest ETA", "Distance", "Route Number"];

export default function NearbyBusesPage() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <TopAppBar showSearch />

        <div
          className="page-enter"
          style={{
            marginTop: "64px",
            minHeight: "calc(100vh - 64px)",
            backgroundColor: "var(--color-surface-container-low)",
            padding: "2rem",
          }}
        >
          {/* Header Row */}
          <div
            style={{
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "var(--color-on-surface)",
                letterSpacing: "-0.015em",
              }}
            >
              Active Routes
            </h1>

            {/* Sort Chips */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {SORT_OPTIONS.map((opt, i) => (
                <button
                  key={opt}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    backgroundColor:
                      i === 0
                        ? "var(--color-secondary-container)"
                        : "var(--color-surface-container-high)",
                    color:
                      i === 0
                        ? "var(--color-on-secondary-container)"
                        : "var(--color-on-surface)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Bus List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {BUS_ROUTES.map((route) => (
              <div
                key={route.id}
                className="card"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  opacity: route.status === "delayed" ? 0.9 : 1,
                }}
              >
                {/* Left: Route Info */}
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                  {/* Route Number Badge */}
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "var(--radius-lg)",
                      backgroundColor:
                        route.status === "active"
                          ? "rgba(37, 99, 235, 0.15)"
                          : "var(--color-surface-container-high)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color:
                        route.status === "active"
                          ? "var(--color-primary)"
                          : "var(--color-on-surface-variant)",
                      flexShrink: 0,
                    }}
                  >
                    {route.number}
                  </div>

                  <div>
                    {/* Route Name + Status Badge */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "0.375rem",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: 700,
                          color: "var(--color-on-surface)",
                        }}
                      >
                        {route.name}
                      </h3>
                      <span
                        className={`badge ${route.status === "active" ? "badge-active" : "badge-delayed"}`}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor:
                              route.status === "active" ? "#16a34a" : "#ef4444",
                            display: "inline-block",
                          }}
                        />
                        {route.status === "active" ? "Active" : "Delayed"}
                      </span>
                    </div>

                    {/* ETA + Bus Type */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--color-on-surface-variant)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                        schedule
                      </span>
                      <span>
                        ETA:{" "}
                        <strong style={{ color: route.etaColor }}>{route.eta}</strong>
                      </span>
                      <span
                        style={{
                          width: "3px",
                          height: "3px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-outline-variant)",
                          margin: "0 0.25rem",
                        }}
                      />
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                        directions_bus
                      </span>
                      <span>{route.type}</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  className="btn-primary"
                  style={{
                    width: "auto",
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.9375rem",
                  }}
                >
                  Select Bus
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
