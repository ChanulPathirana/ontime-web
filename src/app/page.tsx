import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";

export default function RoutesPage() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <TopAppBar title="On Time" />

        {/* Page Canvas */}
        <div
          className="page-enter"
          style={{
            paddingTop: "88px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            paddingBottom: "3rem",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          {/* Hero: Asymmetric 5/7 Grid Layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "5fr 7fr",
              gap: "2rem",
              alignItems: "start",
            }}
          >
            {/* Left: Search Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Heading */}
              <div style={{ marginBottom: "0.5rem" }}>
                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    color: "var(--color-on-surface)",
                    letterSpacing: "-0.025em",
                    marginBottom: "0.5rem",
                  }}
                >
                  Where to?
                </h2>
                <p style={{ color: "var(--color-on-surface-variant)", fontWeight: 500 }}>
                  Find the optimal route across the transit network.
                </p>
              </div>

              {/* Search Card */}
              <div
                className="card"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  position: "relative",
                }}
              >
                {/* Origin Input */}
                <div className="input-wrapper">
                  <div className="input-icon">
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "18px",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      my_location
                    </span>
                  </div>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Origin"
                    defaultValue="Current Location"
                  />
                </div>

                {/* Connector + Swap */}
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "1.25rem",
                      width: "2px",
                      height: "24px",
                      backgroundColor: "var(--color-surface-container-high)",
                    }}
                  />
                  <button
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-surface-container-low)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-outline)",
                      marginLeft: "auto",
                      marginRight: "0",
                      transition: "all 0.2s ease",
                    }}
                    aria-label="Swap origin and destination"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                      swap_vert
                    </span>
                  </button>
                </div>

                {/* Destination Input */}
                <div className="input-wrapper">
                  <div className="input-icon" style={{ color: "var(--color-outline-variant)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                      location_on
                    </span>
                  </div>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Destination"
                  />
                </div>

                {/* Options Row */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button className="btn-secondary">
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                      schedule
                    </span>
                    Leave Now
                  </button>
                  <button className="btn-chip">Options</button>
                </div>

                {/* CTA Button */}
                <button className="btn-primary" style={{ marginTop: "0.5rem" }}>
                  Search Route
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                    arrow_forward
                  </span>
                </button>
              </div>

              {/* Recent Searches */}
              <div>
                <h3
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--color-on-surface-variant)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "1rem",
                  }}
                >
                  Recent Searches
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    {
                      icon: "work",
                      title: "Home to Work",
                      subtitle: "Via Line A • 45 mins",
                    },
                    {
                      icon: "business_center",
                      title: "Downtown Center",
                      subtitle: "From Current Location • 22 mins",
                    },
                  ].map((item) => (
                    <button
                      key={item.title}
                      className="card"
                      style={{
                        padding: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        textAlign: "left",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-surface-container)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--color-on-surface-variant)",
                          flexShrink: 0,
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                          {item.icon}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--color-on-surface)" }}>
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--color-outline)",
                            fontWeight: 500,
                            marginTop: "0.125rem",
                          }}
                        >
                          {item.subtitle}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Map Canvas */}
            <div
              style={{
                height: "600px",
                backgroundColor: "var(--color-surface-container-low)",
                borderRadius: "var(--radius-lg)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "var(--shadow-ambient)",
              }}
            >
              {/* Map Placeholder */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, #e8ecf4 0%, #dce3f0 30%, #e4e8f2 60%, #d8dff0 100%)",
                }}
              >
                {/* Simulated road lines using CSS */}
                <svg
                  width="100%"
                  height="100%"
                  style={{ position: "absolute", inset: 0, opacity: 0.5 }}
                >
                  <line x1="0" y1="40%" x2="100%" y2="35%" stroke="#b8c4d8" strokeWidth="12" />
                  <line x1="0" y1="60%" x2="100%" y2="55%" stroke="#b8c4d8" strokeWidth="8" />
                  <line x1="25%" y1="0" x2="20%" y2="100%" stroke="#b8c4d8" strokeWidth="8" />
                  <line x1="65%" y1="0" x2="70%" y2="100%" stroke="#b8c4d8" strokeWidth="10" />
                  <line x1="0" y1="20%" x2="100%" y2="75%" stroke="#c4cfe0" strokeWidth="5" />
                  <rect x="30%" y="25%" width="12%" height="20%" fill="#cdd5e4" rx="4" />
                  <rect x="55%" y="30%" width="8%" height="15%" fill="#cdd5e4" rx="4" />
                  <rect x="15%" y="55%" width="10%" height="18%" fill="#cdd5e4" rx="4" />
                  <rect x="72%" y="55%" width="14%" height="22%" fill="#cdd5e4" rx="4" />
                </svg>
                {/* Route overlay */}
                <svg
                  width="100%"
                  height="100%"
                  style={{ position: "absolute", inset: 0 }}
                >
                  <path
                    d="M 80 450 Q 250 250, 500 310 T 880 120"
                    fill="none"
                    stroke="#004ac6"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="14 8"
                    opacity="0.85"
                  />
                  <path
                    d="M 80 450 Q 250 250, 500 310 T 880 120"
                    fill="none"
                    stroke="#004ac6"
                    strokeWidth="9"
                    strokeLinecap="round"
                    opacity="0.15"
                  />
                  {/* Current location marker */}
                  <circle cx="500" cy="310" r="12" fill="#004ac6" />
                  <circle cx="500" cy="310" r="6" fill="white" />
                  <circle cx="500" cy="310" r="20" fill="#004ac6" opacity="0.2" />
                  {/* Stop markers */}
                  <circle cx="250" cy="370" r="7" fill="white" stroke="#737686" strokeWidth="2" />
                  <circle cx="700" cy="210" r="7" fill="white" stroke="#004ac6" strokeWidth="3" />
                </svg>
              </div>

              {/* Glass Overlay — bottom */}
              <div
                className="glass-panel"
                style={{
                  position: "absolute",
                  bottom: "1.5rem",
                  left: "1.5rem",
                  right: "1.5rem",
                  borderRadius: "var(--radius-lg)",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div className="live-dot" />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "var(--color-on-surface)",
                    }}
                  >
                    Live Network Status:{" "}
                    <span style={{ color: "#16a34a" }}>Good Service</span>
                  </span>
                </div>
                <button
                  className="card"
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-on-surface)",
                    transition: "color 0.2s ease",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                    my_location
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
