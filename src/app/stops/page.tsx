"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";

interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distance: string;
  routes: string[];
}

const BUS_STOPS: BusStop[] = [
  {
    id: "1",
    name: "Central Station",
    lat: 45,
    lng: 35,
    distance: "0.2 km",
    routes: ["882", "120", "138"],
  },
  {
    id: "2",
    name: "Market Square",
    lat: 55,
    lng: 50,
    distance: "0.5 km",
    routes: ["120", "204", "138"],
  },
  {
    id: "3",
    name: "City Hall",
    lat: 35,
    lng: 65,
    distance: "0.8 km",
    routes: ["882", "204"],
  },
  {
    id: "4",
    name: "University Junction",
    lat: 65,
    lng: 30,
    distance: "1.1 km",
    routes: ["138", "204", "120"],
  },
  {
    id: "5",
    name: "Shopping Mall",
    lat: 75,
    lng: 55,
    distance: "1.4 km",
    routes: ["882", "138"],
  },
];

export default function BusStopsPage() {
  const router = useRouter();
  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const [hoveredStop, setHoveredStop] = useState<string | null>(null);

  const handleStopSelect = (stopId: string) => {
    setSelectedStop(stopId);
  };

  const handleViewBuses = () => {
    if (selectedStop) {
      const stop = BUS_STOPS.find((s) => s.id === selectedStop);
      router.push(`/stop-details?id=${selectedStop}&name=${stop?.name}`);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <TopAppBar title="Nearby Bus Stops" />

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
            {/* City grid */}
            <svg
              width="100%"
              height="100%"
              style={{ position: "absolute", inset: 0, opacity: 0.55 }}
            >
              <line x1="0" y1="38%" x2="100%" y2="32%" stroke="#b0bdd4" strokeWidth="18" />
              <line x1="0" y1="62%" x2="100%" y2="58%" stroke="#b0bdd4" strokeWidth="14" />
              <line x1="22%" y1="0" x2="18%" y2="100%" stroke="#b0bdd4" strokeWidth="14" />
              <line x1="62%" y1="0" x2="66%" y2="100%" stroke="#b0bdd4" strokeWidth="16" />
              <line x1="0" y1="20%" x2="100%" y2="16%" stroke="#bec8db" strokeWidth="8" />
              <line x1="0" y1="78%" x2="100%" y2="80%" stroke="#bec8db" strokeWidth="8" />
              <line x1="42%" y1="0" x2="44%" y2="100%" stroke="#bec8db" strokeWidth="8" />
              <line x1="82%" y1="0" x2="84%" y2="100%" stroke="#bec8db" strokeWidth="8" />
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

            {/* Bus Stop Markers */}
            <svg
              width="100%"
              height="100%"
              style={{ position: "absolute", inset: 0 }}
            >
              {BUS_STOPS.map((stop) => {
                const isSelected = selectedStop === stop.id;
                const isHovered = hoveredStop === stop.id;
                const scale = isSelected ? 1.3 : isHovered ? 1.15 : 1;

                return (
                  <g
                    key={stop.id}
                    style={{
                      cursor: "pointer",
                      transform: `scale(${scale})`,
                      transformOrigin: `${stop.lng}% ${stop.lat}%`,
                      transition: "transform 0.2s ease",
                    }}
                    onClick={() => handleStopSelect(stop.id)}
                    onMouseEnter={() => setHoveredStop(stop.id)}
                    onMouseLeave={() => setHoveredStop(null)}
                  >
                    {/* Pulse ring for selected */}
                    {isSelected && (
                      <circle
                        cx={`${stop.lng}%`}
                        cy={`${stop.lat}%`}
                        r="28"
                        fill="none"
                        stroke="#004ac6"
                        strokeWidth="3"
                        opacity="0.4"
                      >
                        <animate
                          attributeName="r"
                          from="20"
                          to="35"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.6"
                          to="0"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    {/* Stop marker */}
                    <circle
                      cx={`${stop.lng}%`}
                      cy={`${stop.lat}%`}
                      r="16"
                      fill={isSelected ? "#004ac6" : "white"}
                      stroke={isSelected ? "#004ac6" : "#737686"}
                      strokeWidth={isSelected ? "4" : "3"}
                    />
                    <circle
                      cx={`${stop.lng}%`}
                      cy={`${stop.lat}%`}
                      r="8"
                      fill={isSelected ? "white" : "#737686"}
                    />
                  </g>
                );
              })}

              {/* Current location */}
              <circle cx="50%" cy="50%" r="14" fill="#004ac6" />
              <circle cx="50%" cy="50%" r="7" fill="white" />
              <circle cx="50%" cy="50%" r="22" fill="#004ac6" opacity="0.2">
                <animate attributeName="r" from="18" to="28" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {/* Search Bar Overlay */}
          <div
            className="glass-panel"
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "1.5rem",
              right: "1.5rem",
              borderRadius: "var(--radius-lg)",
              padding: "1rem 1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span className="material-symbols-outlined" style={{ color: "var(--color-outline)" }}>
              search
            </span>
            <input
              type="text"
              placeholder="Search by location..."
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                fontSize: "0.9375rem",
                color: "var(--color-on-surface)",
                outline: "none",
              }}
            />
            <button
              className="card"
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-on-surface)",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                my_location
              </span>
            </button>
          </div>

          {/* Stops List Panel */}
          <div
            className="glass-panel"
            style={{
              position: "absolute",
              bottom: "1.5rem",
              left: "1.5rem",
              width: "420px",
              maxHeight: "60vh",
              borderRadius: "var(--radius-xl)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--color-on-surface)",
                }}
              >
                Nearby Stops
              </h3>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-on-surface-variant)",
                  fontWeight: 500,
                }}
              >
                {BUS_STOPS.length} found
              </span>
            </div>

            {/* Stop Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {BUS_STOPS.map((stop) => (
                <button
                  key={stop.id}
                  onClick={() => handleStopSelect(stop.id)}
                  onMouseEnter={() => setHoveredStop(stop.id)}
                  onMouseLeave={() => setHoveredStop(null)}
                  className="card"
                  style={{
                    padding: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    textAlign: "left",
                    cursor: "pointer",
                    outline: selectedStop === stop.id ? "2px solid var(--color-primary)" : "none",
                    outlineOffset: "2px",
                    backgroundColor: selectedStop === stop.id
                      ? "rgba(0, 74, 198, 0.08)"
                      : "var(--color-surface-container-lowest)",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: selectedStop === stop.id
                        ? "var(--color-primary)"
                        : "var(--color-surface-container)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "24px",
                        color: selectedStop === stop.id
                          ? "white"
                          : "var(--color-on-surface-variant)",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      place
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "var(--color-on-surface)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {stop.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--color-on-surface-variant)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                        route
                      </span>
                      {stop.routes.length} routes • {stop.distance}
                    </div>
                  </div>
                  {selectedStop === stop.id && (
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "20px",
                        color: "var(--color-primary)",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      check_circle
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Action Button */}
            {selectedStop && (
              <button
                className="btn-primary"
                onClick={handleViewBuses}
                style={{
                  marginTop: "0.5rem",
                  width: "100%",
                }}
              >
                View Available Buses
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  arrow_forward
                </span>
              </button>
            )}
          </div>

          {/* Recenter Button */}
          <button
            className="card"
            style={{
              position: "absolute",
              bottom: "1.5rem",
              right: "1.5rem",
              width: "56px",
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              boxShadow: "var(--shadow-ambient)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "24px",
                color: "var(--color-on-surface)",
              }}
            >
              my_location
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
