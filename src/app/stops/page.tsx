"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";
import { TRANSIT_ROUTES } from "@/lib/transitData";

const DEFAULT_CENTER: [number, number] = [79.8612, 6.9271];
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
const HAS_MAPBOX_TOKEN = Boolean(MAPBOX_TOKEN);

// Build a deduplicated stop list from all routes
interface MappedStop {
  id: string;
  name: string;
  coordinates: [number, number];
  routes: string[];
}

function buildStops(): MappedStop[] {
  const map = new Map<string, MappedStop>();
  Object.values(TRANSIT_ROUTES).forEach((route) => {
    route.stops.forEach((stop) => {
      const key = stop.name;
      if (map.has(key)) {
        map.get(key)!.routes.push(route.number);
      } else {
        map.set(key, {
          id: key,
          name: stop.name,
          coordinates: stop.coordinates,
          routes: [route.number],
        });
      }
    });
  });
  return Array.from(map.values());
}

const BUS_STOPS = buildStops();

function stopDot(selected: boolean): HTMLDivElement {
  const el = document.createElement("div");
  el.style.cssText = [
    "width:20px",
    "height:20px",
    "border-radius:50%",
    "cursor:pointer",
    "border:3px solid white",
    "box-shadow:0 2px 8px rgba(0,0,0,0.25)",
    "transition:transform 0.15s ease, background 0.15s ease",
    `background:${selected ? "#004ac6" : "#64748b"}`,
  ].join(";");
  return el;
}

export default function BusStopsPage() {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const markerEls = useRef<Map<string, HTMLDivElement>>(new Map());

  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locating, setLocating] = useState(false);

  function requestLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords;
        userMarker.current?.setLngLat([longitude, latitude]);
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          duration: 900,
        });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    if (!HAS_MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN!;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DEFAULT_CENTER,
      zoom: 14,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      const m = map.current!;

      // Draw route lines for context
      Object.values(TRANSIT_ROUTES).forEach((route) => {
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
            "line-color": route.color,
            "line-width": 2.5,
            "line-opacity": 0.5,
          },
        });
      });

      // User dot
      const userEl = document.createElement("div");
      userEl.style.cssText =
        "width:18px;height:18px;border-radius:50%;background:#004ac6;border:3px solid white;box-shadow:0 0 0 6px rgba(0,74,198,0.15)";
      userMarker.current = new mapboxgl.Marker({ element: userEl })
        .setLngLat(DEFAULT_CENTER)
        .addTo(m);

      // Stop markers
      BUS_STOPS.forEach((stop) => {
        const el = stopDot(false);
        markerEls.current.set(stop.id, el);
        new mapboxgl.Marker({ element: el, anchor: "center" })
          .setLngLat(stop.coordinates)
          .addTo(m);
        el.addEventListener("click", () => selectStop(stop.id));
      });

      requestLocation();
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync marker colours with selection
  useEffect(() => {
    markerEls.current.forEach((el, id) => {
      const sel = id === selectedStop;
      el.style.background = sel ? "#004ac6" : "#64748b";
      el.style.transform = sel ? "scale(1.35)" : "scale(1)";
    });
  }, [selectedStop]);

  function selectStop(id: string) {
    setSelectedStop(id);
    const stop = BUS_STOPS.find((s) => s.id === id);
    if (stop && map.current) {
      map.current.flyTo({
        center: stop.coordinates,
        zoom: 15.5,
        duration: 700,
      });
    }
  }

  const filtered = BUS_STOPS.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <main
        className="main-content"
        style={{ overflow: "hidden", height: "100vh", position: "relative" }}
      >
        <TopAppBar title="Nearby Stops" />

        {HAS_MAPBOX_TOKEN ? (
          <div
            ref={mapContainer}
            style={{ position: "absolute", inset: 0, top: 64, zIndex: 0 }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              top: 64,
              zIndex: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
              color: "#334155",
              fontWeight: 700,
            }}
          >
            Stops map unavailable: set NEXT_PUBLIC_MAPBOX_TOKEN
          </div>
        )}

        {/* Search bar */}
        <div
          className="glass-panel"
          style={{
            position: "absolute",
            top: 88,
            left: 280,
            right: "1.5rem",
            borderRadius: "var(--radius-lg)",
            padding: "0.75rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            zIndex: 10,
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: "var(--color-outline)", fontSize: "20px" }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Search bus stops…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            onClick={requestLocation}
            disabled={locating || !HAS_MAPBOX_TOKEN}
            className="card"
            title="Use my location"
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-md)",
              color: locating
                ? "var(--color-primary)"
                : "var(--color-on-surface-variant)",
              flexShrink: 0,
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

        {/* Stop list panel */}
        <div
          className="glass-panel"
          style={{
            position: "absolute",
            bottom: "1.5rem",
            right: 50,
            width: 360,
            maxHeight: "calc(100vh - 200px)",
            borderRadius: "var(--radius-xl)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.875rem",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                fontSize: "1.125rem",
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
              {filtered.length} found
            </span>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {filtered.map((stop) => (
              <button
                key={stop.id}
                onClick={() => selectStop(stop.id)}
                className="card"
                style={{
                  padding: "0.875rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  outline:
                    selectedStop === stop.id
                      ? "2px solid var(--color-primary)"
                      : "none",
                  outlineOffset: "2px",
                  backgroundColor:
                    selectedStop === stop.id
                      ? "rgba(0,74,198,0.07)"
                      : "var(--color-surface-container-lowest)",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor:
                      selectedStop === stop.id
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
                      fontSize: "22px",
                      color:
                        selectedStop === stop.id
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
                      marginBottom: "0.2rem",
                    }}
                  >
                    {stop.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--color-on-surface-variant)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "13px" }}
                    >
                      route
                    </span>
                    {stop.routes.join(", ")}
                  </div>
                </div>
                {selectedStop === stop.id && (
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "20px",
                      color: "var(--color-primary)",
                      fontVariationSettings: "'FILL' 1",
                      flexShrink: 0,
                    }}
                  >
                    check_circle
                  </span>
                )}
              </button>
            ))}
          </div>

          {selectedStop && (
            <button
              className="btn-primary"
              style={{ width: "100%" }}
              onClick={() =>
                router.push(
                  `/stop-details?id=${encodeURIComponent(selectedStop)}&name=${encodeURIComponent(selectedStop)}`,
                )
              }
            >
              View Available Buses
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                arrow_forward
              </span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
