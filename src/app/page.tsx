"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";
import { searchRoutes, fetchAllTransitRoutes } from "@/services/api";

const DEFAULT_CENTER: [number, number] = [79.8612, 6.9271];
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
const HAS_MAPBOX_TOKEN = Boolean(MAPBOX_TOKEN);

export default function RoutesPage() {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);

  const [locating, setLocating] = useState(false);
  const [originLabel, setOriginLabel] = useState("Current Location");
  const [destinationLabel, setDestinationLabel] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const userCoords = useRef<[number, number] | null>(null);

  function flyToUser(lng: number, lat: number) {
    userMarker.current?.setLngLat([lng, lat]);
    map.current?.flyTo({ center: [lng, lat], zoom: 14, duration: 1000 });
  }

  function requestLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        flyToUser(pos.coords.longitude, pos.coords.latitude);
        userCoords.current = [pos.coords.longitude, pos.coords.latitude];
        setOriginLabel("My Location");
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  async function handleSearch() {
    // If no destination, just go to stops page
    if (!destinationLabel.trim()) {
      router.push("/stops");
      return;
    }
    // If no user location yet, go to stops
    if (!userCoords.current) {
      router.push("/stops");
      return;
    }
    // Geocode destination using Mapbox if token available
    if (!HAS_MAPBOX_TOKEN) {
      router.push("/stops");
      return;
    }
    setIsSearching(true);
    try {
      const geoRes = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destinationLabel)}.json?access_token=${MAPBOX_TOKEN}&country=LK&limit=1`,
      );
      const geoData = await geoRes.json();
      const [destLng, destLat] = geoData.features?.[0]?.center ?? [];
      if (!destLng || !destLat) {
        router.push("/stops");
        return;
      }
      const [originLng, originLat] = userCoords.current;
      const result = await searchRoutes(originLat, originLng, destLat, destLng);
      if (result.count > 0) {
        const ids = result.routes.map((r) => r.route_id).join(",");
        router.push(`/nearby?routeIds=${ids}&stop=${encodeURIComponent(originLabel)}`);
      } else {
        router.push("/stops");
      }
    } catch {
      router.push("/stops");
    } finally {
      setIsSearching(false);
    }
  }

  useEffect(() => {

    mapboxgl.accessToken = MAPBOX_TOKEN!;

    if (!mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DEFAULT_CENTER,
      zoom: 13,
      interactive: false,
    });

    map.current.on("load", () => {
      const m = map.current!;

      // Draw routes from API
      fetchAllTransitRoutes()
        .then((routesMap) => {
          Object.values(routesMap).forEach((route) => {
            if (!route.path?.length) return;
            m.addSource(`route-${route.id}`, {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: { type: "LineString", coordinates: route.path },
              },
            });
            m.addLayer({
              id: `route-${route.id}`,
              type: "line",
              source: `route-${route.id}`,
              layout: { "line-join": "round", "line-cap": "round" },
              paint: {
                "line-color": route.color || "#004ac6",
                "line-width": 3,
                "line-opacity": 0.75,
              },
            });

            // Stop markers
            const seen = new Set<string>();
            route.stops?.forEach((stop) => {
              const key = stop.coordinates.join(",");
              if (seen.has(key)) return;
              seen.add(key);
              const el = document.createElement("div");
              el.style.cssText =
                "width:10px;height:10px;border-radius:50%;background:white;border:2.5px solid #004ac6;box-shadow:0 1px 4px rgba(0,74,198,0.3)";
              new mapboxgl.Marker({ element: el })
                .setLngLat(stop.coordinates)
                .setPopup(
                  new mapboxgl.Popup({ offset: 10, closeButton: false }).setText(
                    stop.name,
                  ),
                )
                .addTo(m);
            });
          });
        })
        .catch(() => {});

      // User dot
      const userEl = document.createElement("div");
      userEl.style.cssText =
        "width:16px;height:16px;border-radius:50%;background:#004ac6;border:3px solid white;box-shadow:0 0 0 5px rgba(0,74,198,0.2)";
      userMarker.current = new mapboxgl.Marker({ element: userEl })
        .setLngLat(DEFAULT_CENTER)
        .addTo(m);

      requestLocation();
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <TopAppBar title="On Time" />

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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "5fr 7fr",
              gap: "2rem",
              alignItems: "start",
            }}
          >
            {/* Search panel */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div>
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
                <p
                  style={{
                    color: "var(--color-on-surface-variant)",
                    fontWeight: 500,
                  }}
                >
                  Find the best route across the transit network.
                </p>
              </div>

              <div
                className="card"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
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
                    value={originLabel}
                    onChange={(e) => setOriginLabel(e.target.value)}
                  />
                </div>

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
                    aria-label="Swap"
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
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "16px" }}
                    >
                      swap_vert
                    </span>
                  </button>
                </div>

                <div className="input-wrapper">
                  <div
                    className="input-icon"
                    style={{ color: "var(--color-outline-variant)" }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "18px" }}
                    >
                      location_on
                    </span>
                  </div>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Destination"
                    value={destinationLabel}
                    onChange={(e) => setDestinationLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginTop: "0.25rem",
                  }}
                >
                  <button className="btn-secondary">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "16px" }}
                    >
                      schedule
                    </span>
                    Leave Now
                  </button>
                  <button className="btn-chip">Options</button>
                </div>

                <button
                  className="btn-primary"
                  style={{ marginTop: "0.25rem" }}
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? "Searching…" : "Search Route"}
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    {isSearching ? "progress_activity" : "arrow_forward"}
                  </span>
                </button>
              </div>
              
            </div>

            {/* Mapbox preview */}
            <div
              style={{
                height: "600px",
                borderRadius: "var(--radius-lg)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "var(--shadow-ambient)",
              }}
            >
              {HAS_MAPBOX_TOKEN ? (
                <div
                  ref={mapContainer}
                  style={{ position: "absolute", inset: 0 }}
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)",
                    color: "#1e3a8a",
                    fontWeight: 700,
                  }}
                >
                  Map preview unavailable: set NEXT_PUBLIC_MAPBOX_TOKEN
                </div>
              )}
              <div
                className="glass-panel"
                style={{
                  position: "absolute",
                  bottom: "1.5rem",
                  left: "1.5rem",
                  right: "1.5rem",
                  borderRadius: "var(--radius-lg)",
                  padding: "0.875rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div className="live-dot" />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "var(--color-on-surface)",
                    }}
                  >
                    Live Network:{" "}
                    <span style={{ color: "#16a34a" }}>Good Service</span>
                  </span>
                </div>
                <button
                  onClick={requestLocation}
                  disabled={locating || !HAS_MAPBOX_TOKEN}
                  className="card"
                  style={{
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--radius-md)",
                    color: locating
                      ? "var(--color-primary)"
                      : "var(--color-on-surface)",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "18px" }}
                  >
                    {locating ? "progress_activity" : "my_location"}
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
