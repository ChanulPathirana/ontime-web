"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";
import { fetchRoutes, fetchBusesByRoute } from "@/services/api";

interface BusRoute {
  id: string;
  number: string;
  name: string;
  destination: string;
  status: "active" | "delayed";
  eta: string;
  etaColor: string;
  type: string;
}

const SORT_OPTIONS = ["Shortest ETA", "Distance", "Route Number"];

function NearbyBusesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParam = searchParams.get("route");
  const stopParam = searchParams.get("stop");
  const routeId = searchParams.get("routeId");         // DB route id — for fleet bus fetch
  const routeIdsParam = searchParams.get("routeIds");  // comma list — from home page search

  const [allRoutes, setAllRoutes] = useState<BusRoute[]>([]);
  const [destinationFilter, setDestinationFilter] = useState("");
  const [sortOption, setSortOption] = useState(0);

  // When a specific routeId is known, fetch actual fleet buses assigned to that route
  useEffect(() => {
    if (!routeId) return;
    fetchBusesByRoute(routeId)
      .then((buses) => {
        if (buses.length === 0) return; // fall back to route list
        const mapped: BusRoute[] = buses.map((b) => ({
          id: b.id,
          number: b.fleet_code,
          name: `Bus ${b.fleet_code} · ${b.plate_number}`,
          destination: routeParam ? `Route ${routeParam}` : "Route service",
          status: (b.status === "active" ? "active" : "delayed") as "active" | "delayed",
          eta: "Live",
          etaColor: "#16a34a",
          type: `Capacity: ${b.capacity ?? "--"}`,
        }));
        setAllRoutes(mapped);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  // Fallback: load all routes (used when no specific routeId, e.g. browsing all buses)
  useEffect(() => {
    if (routeId) return; // already loading from fleet
    fetchRoutes()
      .then((data) => {
        const mapped: BusRoute[] = data.map((r) => {
          const parts = r.name.split(" - ");
          return {
            id: String(r.id),
            number: r.route_number ?? String(r.id),
            name: r.name,
            destination: r.destination ?? parts[1]?.trim() ?? parts[0] ?? r.name,
            status: "active" as const,
            eta: "Live",
            etaColor: "#16a34a",
            type: "Bus",
          };
        });
        setAllRoutes(mapped);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  // Filter buses by route parameter
  let filteredBuses = routeParam
    ? allRoutes.filter((bus) => bus.number === routeParam)
    : allRoutes;

  // When home page search returned specific route IDs, filter to those
  if (routeIdsParam && !routeId) {
    const ids = new Set(routeIdsParam.split(","));
    filteredBuses = allRoutes.filter((bus) => ids.has(bus.id));
  }

  // Filter by destination
  if (destinationFilter.trim()) {
    filteredBuses = filteredBuses.filter((bus) =>
      bus.destination.toLowerCase().includes(destinationFilter.toLowerCase())
    );
  }

  // Sort buses
  const sortedBuses = [...filteredBuses].sort((a, b) => {
    if (sortOption === 0 || sortOption === 1) {
      const ea = parseInt(a.eta);
      const eb = parseInt(b.eta);
      if (isNaN(ea) && isNaN(eb)) return 0;
      if (isNaN(ea)) return 1;
      if (isNaN(eb)) return -1;
      return ea - eb;
    } else {
      return a.number.localeCompare(b.number, undefined, { numeric: true });
    }
  });

  const handleSelectBus = (busId: string) => {
    const bus = allRoutes.find((b) => b.id === busId);
    const routeNum = bus?.number ?? busId;
    // When coming from fleet (routeId present), pass the fleet bus id directly
    const busParam = routeId
      ? `${busId}`
      : `BUS-${routeNum.padStart(2, "0")}`;
    const routeDbParam = routeId ? `&routeDbId=${routeId}` : "";
    router.push(`/tracking?bus=${busParam}&route=${routeNum}${routeDbParam}`);
  };
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
          {/* Breadcrumb */}
          {(routeParam || stopParam) && (
            <div
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                color: "var(--color-on-surface-variant)",
              }}
            >
              <span>{stopParam || "Stop"}</span>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                chevron_right
              </span>
              <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                Route {routeParam || "All"}
              </span>
            </div>
          )}

          {/* Header Row */}
          <div
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "var(--color-on-surface)",
                  letterSpacing: "-0.015em",
                  marginBottom: "0.375rem",
                }}
              >
                {routeParam ? `Route ${routeParam} Buses` : "Active Routes"}
              </h1>
              <p style={{ color: "var(--color-on-surface-variant)", fontSize: "0.9375rem" }}>
                {sortedBuses.length} {sortedBuses.length === 1 ? "bus" : "buses"} available
              </p>
            </div>

            {/* Sort Chips */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {SORT_OPTIONS.map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => setSortOption(i)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    backgroundColor:
                      i === sortOption
                        ? "var(--color-secondary-container)"
                        : "var(--color-surface-container-high)",
                    color:
                      i === sortOption
                        ? "var(--color-on-secondary-container)"
                        : "var(--color-on-surface)",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Destination Filter */}
          <div
            className="card"
            style={{
              padding: "1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px", color: "var(--color-outline)" }}
            >
              filter_alt
            </span>
            <input
              type="text"
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              placeholder="Filter by destination (e.g., Piliyandala, Maharagama)"
              className="input-field"
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                fontSize: "0.9375rem",
                padding: 0,
              }}
            />
            {destinationFilter && (
              <button
                onClick={() => setDestinationFilter("")}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-surface-container)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px", color: "var(--color-on-surface)" }}
                >
                  close
                </span>
              </button>
            )}
          </div>

          {/* Bus List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {sortedBuses.length === 0 ? (
              <div
                className="card"
                style={{
                  padding: "3rem 2rem",
                  textAlign: "center",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "64px",
                    color: "var(--color-outline-variant)",
                    marginBottom: "1rem",
                  }}
                >
                  search_off
                </span>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--color-on-surface)",
                    marginBottom: "0.5rem",
                  }}
                >
                  No Buses Found
                </h3>
                <p style={{ color: "var(--color-on-surface-variant)" }}>
                  Try adjusting your filter to see more results.
                </p>
              </div>
            ) : (
              sortedBuses.map((route) => (
              <div
                key={route.id}
                className="card"
                onClick={() => handleSelectBus(route.id)}
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  opacity: route.status === "delayed" ? 0.9 : 1,
                  cursor: "pointer",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-elevated)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "";
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
                  onClick={(e) => { e.stopPropagation(); handleSelectBus(route.id); }}
                  className="btn-primary"
                  style={{
                    width: "auto",
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.9375rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>directions_bus</span>
                  Track Bus
                </button>
              </div>
            ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function NearbyBusesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NearbyBusesContent />
    </Suspense>
  );
}
