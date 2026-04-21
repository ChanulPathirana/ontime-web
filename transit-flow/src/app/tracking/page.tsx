import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";

interface Stop {
  name: string;
  time: string;
  state: "passed" | "current" | "upcoming";
}

const STOPS: Stop[] = [
  { name: "Central Station", time: "Departed 10:42 AM", state: "passed" },
  { name: "Market Square", time: "Arriving 10:47 AM", state: "current" },
  { name: "North Terminal", time: "Expected 11:05 AM", state: "upcoming" },
  { name: "East Junction", time: "Expected 11:18 AM", state: "upcoming" },
];

export default function TrackingPage() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main
        className="main-content"
        style={{ overflow: "hidden", height: "100vh" }}
      >
        <TopAppBar title="Transit Flow" />

        {/* Map fills full area */}
        <div
          style={{
            position: "absolute",
            top: "64px",
            left: "256px",
            right: 0,
            bottom: 0,
            backgroundColor: "var(--color-surface-container-high)",
          }}
        >
          {/* Map Background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #e2e8f4 0%, #d4ddf0 40%, #dce4f2 70%, #cfd9ef 100%)",
            }}
          >
            {/* Stylized city grid */}
            <svg
              width="100%"
              height="100%"
              style={{ position: "absolute", inset: 0, opacity: 0.55 }}
            >
              {/* Main roads */}
              <line x1="0" y1="38%" x2="100%" y2="32%" stroke="#b0bdd4" strokeWidth="18" />
              <line x1="0" y1="62%" x2="100%" y2="58%" stroke="#b0bdd4" strokeWidth="14" />
              <line x1="22%" y1="0" x2="18%" y2="100%" stroke="#b0bdd4" strokeWidth="14" />
              <line x1="62%" y1="0" x2="66%" y2="100%" stroke="#b0bdd4" strokeWidth="16" />
              {/* Secondary roads */}
              <line x1="0" y1="20%" x2="100%" y2="16%" stroke="#bec8db" strokeWidth="8" />
              <line x1="0" y1="78%" x2="100%" y2="80%" stroke="#bec8db" strokeWidth="8" />
              <line x1="42%" y1="0" x2="44%" y2="100%" stroke="#bec8db" strokeWidth="8" />
              <line x1="82%" y1="0" x2="84%" y2="100%" stroke="#bec8db" strokeWidth="8" />
              {/* City blocks */}
              <rect x="24%" y="15%" width="15%" height="20%" fill="#c8d2e2" rx="6" />
              <rect x="45%" y="10%" width="14%" height="18%" fill="#c8d2e2" rx="6" />
              <rect x="68%" y="14%" width="12%" height="16%" fill="#c8d2e2" rx="6" />
              <rect x="5%" y="42%" width="10%" height="14%" fill="#c8d2e2" rx="6" />
              <rect x="24%" y="44%" width="16%" height="12%" fill="#c8d2e2" rx="6" />
              <rect x="68%" y="42%" width="14%" height="12%" fill="#c8d2e2" rx="6" />
              <rect x="5%" y="65%" width="12%" height="18%" fill="#c8d2e2" rx="6" />
              <rect x="45%" y="65%" width="18%" height="20%" fill="#c8d2e2" rx="6" />
              <rect x="68%" y="65%" width="14%" height="22%" fill="#c8d2e2" rx="6" />
            </svg>

            {/* Transit Route SVG Overlay */}
            <svg
              width="100%"
              height="100%"
              style={{ position: "absolute", inset: 0 }}
            >
              {/* Route glow */}
              <path
                d="M 100 520 Q 280 380, 520 390 Q 700 400, 820 280 T 1200 160"
                fill="none"
                stroke="#004ac6"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.15"
              />
              {/* Route dashed line */}
              <path
                d="M 100 520 Q 280 380, 520 390 Q 700 400, 820 280 T 1200 160"
                fill="none"
                stroke="#004ac6"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="14 8"
                opacity="0.9"
              />
              {/* Passed stop */}
              <circle cx="280" cy="400" r="8" fill="#737686" opacity="0.7" />
              <circle cx="280" cy="400" r="4" fill="white" />
              {/* Current bus location (animated pulse) */}
              <circle cx="520" cy="390" r="22" fill="#004ac6" opacity="0.15" />
              <circle cx="520" cy="390" r="14" fill="#004ac6" />
              <circle cx="520" cy="390" r="7" fill="white" />
              {/* Upcoming stop 1 */}
              <circle cx="820" cy="280" r="9" fill="white" stroke="#004ac6" strokeWidth="3" />
              {/* Upcoming stop 2 */}
              <circle cx="1050" cy="210" r="7" fill="white" stroke="#737686" strokeWidth="2" opacity="0.6" />
            </svg>
          </div>

          {/* Floating Map Controls */}
          <div
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "1rem",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <button
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "var(--color-surface-container-lowest)",
                boxShadow: "var(--shadow-ambient-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-on-surface)",
                transition: "all 0.2s ease",
              }}
              aria-label="Center on my location"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                my_location
              </span>
            </button>

            <div
              style={{
                backgroundColor: "var(--color-surface-container-lowest)",
                boxShadow: "var(--shadow-ambient-sm)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <button
                style={{
                  padding: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-on-surface)",
                  transition: "background 0.2s",
                }}
                aria-label="Zoom in"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  add
                </span>
              </button>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "var(--color-surface-container-high)",
                }}
              />
              <button
                style={{
                  padding: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-on-surface)",
                  transition: "background 0.2s",
                }}
                aria-label="Zoom out"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  remove
                </span>
              </button>
            </div>
          </div>

          {/* Right Sidebar Detail Panel */}
          <aside
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              bottom: "1.5rem",
              width: "384px",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              overflowY: "auto",
            }}
          >
            {/* Bus Status Card */}
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                boxShadow: "var(--shadow-float)",
                border: "1px solid rgba(225, 227, 228, 0.3)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1.5rem",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.375rem",
                    }}
                  >
                    <span className="route-chip">Bus #402</span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        backgroundColor: "rgba(37, 99, 235, 0.1)",
                        color: "var(--color-primary)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      Express
                    </span>
                  </div>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--color-on-surface)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Downtown Loop
                  </h2>
                </div>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-lg)",
                    background:
                      "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0, 74, 198, 0.3)",
                    flexShrink: 0,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      color: "white",
                      fontVariationSettings: "'FILL' 1",
                      fontSize: "22px",
                    }}
                  >
                    directions_bus
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div
                  style={{
                    backgroundColor: "var(--color-surface-container-low)",
                    padding: "1rem",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-on-surface-variant)",
                      fontWeight: 500,
                      marginBottom: "0.25rem",
                    }}
                  >
                    Current Speed
                  </p>
                  <p
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "var(--color-on-surface)",
                    }}
                  >
                    45{" "}
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--color-outline)",
                      }}
                    >
                      km/h
                    </span>
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: "var(--color-surface-container-low)",
                    padding: "1rem",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-on-surface-variant)",
                      fontWeight: 500,
                      marginBottom: "0.25rem",
                    }}
                  >
                    Status
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div
                      className="live-dot"
                      style={{ backgroundColor: "#16a34a" }}
                    />
                    <span
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "#16a34a",
                      }}
                    >
                      On Time
                    </span>
                  </div>
                </div>
              </div>

              {/* ETA Highlight */}
              <div
                style={{
                  backgroundColor: "rgba(0, 74, 198, 0.06)",
                  border: "1px solid rgba(0, 74, 198, 0.1)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.25rem",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(0,74,198,0.04) 0%, transparent 100%)",
                  }}
                />
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--color-primary)",
                    marginBottom: "0.25rem",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  Live ETA
                </p>
                <h3
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "var(--color-primary)",
                    letterSpacing: "-0.03em",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  5 mins
                </h3>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-on-surface-variant)",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  to your stop (Market Square)
                </p>
              </div>
            </div>

            {/* Route Timeline Card */}
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                boxShadow: "var(--shadow-float)",
                border: "1px solid rgba(225, 227, 228, 0.3)",
                flex: 1,
              }}
            >
              <h3
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  color: "var(--color-on-surface)",
                  marginBottom: "1.5rem",
                }}
              >
                Stops Timeline
              </h3>

              <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
                {/* Vertical connector line */}
                <div
                  style={{
                    position: "absolute",
                    left: "11px",
                    top: "8px",
                    bottom: "24px",
                    width: "2px",
                    backgroundColor: "var(--color-surface-container-highest)",
                    zIndex: 0,
                  }}
                />

                {STOPS.map((stop, index) => {
                  const isPassed = stop.state === "passed";
                  const isCurrent = stop.state === "current";

                  return (
                    <div
                      key={stop.name}
                      style={{
                        position: "relative",
                        zIndex: 1,
                        marginBottom: index < STOPS.length - 1 ? "2rem" : 0,
                        opacity: isPassed ? 0.6 : 1,
                      }}
                    >
                      {/* Timeline dot */}
                      <div
                        style={{
                          position: "absolute",
                          left: "-24px",
                          top: "4px",
                          width: isCurrent ? "20px" : "16px",
                          height: isCurrent ? "20px" : "16px",
                          borderRadius: "50%",
                          backgroundColor: isCurrent
                            ? "var(--color-primary)"
                            : isPassed
                            ? "var(--color-outline-variant)"
                            : "var(--color-surface-container-lowest)",
                          border: !isCurrent && !isPassed
                            ? "2px solid var(--color-primary)"
                            : isCurrent
                            ? "3px solid white"
                            : "none",
                          boxShadow: isCurrent
                            ? "0 0 0 4px rgba(0, 74, 198, 0.2)"
                            : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginLeft: isCurrent ? "-2px" : "0",
                        }}
                      >
                        {isPassed && (
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontSize: "10px",
                              color: "white",
                              fontVariationSettings: "'FILL' 1",
                            }}
                          >
                            check
                          </span>
                        )}
                      </div>

                      {/* Stop content */}
                      {isCurrent ? (
                        <div
                          style={{
                            backgroundColor: "var(--color-surface-container-low)",
                            padding: "0.75rem 1rem",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid rgba(0, 74, 198, 0.1)",
                            marginTop: "-0.5rem",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "0.9375rem",
                              fontWeight: 700,
                              color: "var(--color-primary)",
                            }}
                          >
                            {stop.name}
                          </p>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--color-on-surface-variant)",
                              marginTop: "0.125rem",
                            }}
                          >
                            {stop.time}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p
                            style={{
                              fontSize: "0.9375rem",
                              fontWeight: isPassed ? 400 : 600,
                              color: isPassed
                                ? "var(--color-on-surface-variant)"
                                : "var(--color-on-surface)",
                            }}
                          >
                            {stop.name}
                          </p>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--color-outline)",
                              marginTop: "0.125rem",
                            }}
                          >
                            {stop.time}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
