"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";

// Set your Mapbox access token from environment variable
// Create a .env.local file with: NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  console.error("NEXT_PUBLIC_MAPBOX_TOKEN is not set. Please add it to .env.local");
}
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface Stop {
  name: string;
  time: string;
  state: "passed" | "current" | "upcoming";
  coordinates: [number, number];
}

const STOPS: Stop[] = [
  { name: "Central Station", time: "Departed 10:42 AM", state: "passed", coordinates: [79.8612, 6.9271] },
  { name: "Market Square", time: "Arriving 10:47 AM", state: "current", coordinates: [79.8650, 6.9300] },
  { name: "North Terminal", time: "Expected 11:05 AM", state: "upcoming", coordinates: [79.8700, 6.9350] },
  { name: "East Junction", time: "Expected 11:18 AM", state: "upcoming", coordinates: [79.8750, 6.9400] },
];

// Simulated bus route path
const ROUTE_PATH: [number, number][] = [
  [79.8612, 6.9271],
  [79.8630, 6.9285],
  [79.8650, 6.9300],
  [79.8670, 6.9320],
  [79.8690, 6.9335],
  [79.8700, 6.9350],
  [79.8720, 6.9370],
  [79.8735, 6.9385],
  [79.8750, 6.9400],
];

export default function TrackingPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const busMarker = useRef<mapboxgl.Marker | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [busSpeed, setBusSpeed] = useState(45);
  const [bearing, setBearing] = useState(0);

  // Calculate bearing (direction) between two coordinates
  const calculateBearing = (start: [number, number], end: [number, number]) => {
    const startLat = (start[1] * Math.PI) / 180;
    const startLng = (start[0] * Math.PI) / 180;
    const endLat = (end[1] * Math.PI) / 180;
    const endLng = (end[0] * Math.PI) / 180;

    const dLng = endLng - startLng;
    const y = Math.sin(dLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
    const bearing = (Math.atan2(y, x) * 180) / Math.PI;

    return (bearing + 360) % 360;
  };

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: ROUTE_PATH[0],
      zoom: 13,
      pitch: 45,
      bearing: 0,
    });

    map.current.on("load", () => {
      if (!map.current) return;

      // Add route line to map
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: ROUTE_PATH,
          },
        },
      });

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#004ac6",
          "line-width": 6,
          "line-opacity": 0.8,
        },
      });

      // Add stop markers
      STOPS.forEach((stop) => {
        const el = document.createElement("div");
        el.style.width = "16px";
        el.style.height = "16px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = stop.state === "passed" ? "#16a34a" : stop.state === "current" ? "#004ac6" : "#94a3b8";
        el.style.border = "3px solid white";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

        new mapboxgl.Marker(el)
          .setLngLat(stop.coordinates)
          .addTo(map.current!);
      });

      // Create custom bus marker with direction arrow
      const busEl = document.createElement("div");
      busEl.style.width = "40px";
      busEl.style.height = "40px";
      busEl.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));">
          <circle cx="20" cy="20" r="18" fill="#004ac6"/>
          <path d="M20 10 L20 30 M15 15 L20 10 L25 15" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;

      busMarker.current = new mapboxgl.Marker({
        element: busEl,
        rotationAlignment: "map",
        pitchAlignment: "map",
      })
        .setLngLat(ROUTE_PATH[0])
        .addTo(map.current);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Animate bus movement along route
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPosition((prev) => {
        const next = (prev + 0.01) % 1;
        const totalSegments = ROUTE_PATH.length - 1;
        const segment = Math.floor(next * totalSegments);
        const segmentProgress = (next * totalSegments) % 1;

        if (segment < ROUTE_PATH.length - 1) {
          const start = ROUTE_PATH[segment];
          const end = ROUTE_PATH[segment + 1];

          // Interpolate position
          const lng = start[0] + (end[0] - start[0]) * segmentProgress;
          const lat = start[1] + (end[1] - start[1]) * segmentProgress;

          // Calculate and update bearing for direction
          const newBearing = calculateBearing(start, end);
          setBearing(newBearing);

          // Update marker position with smooth rotation
          if (busMarker.current) {
            busMarker.current.setLngLat([lng, lat]);
            const el = busMarker.current.getElement();
            el.style.transform = `rotate(${newBearing}deg)`;
            el.style.transition = "transform 0.5s ease-out";
          }

          // Update speed randomly for realism
          setBusSpeed(Math.floor(40 + Math.random() * 15));
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <main
        className="main-content"
        style={{ overflow: "hidden", height: "100vh" }}
      >
        <TopAppBar title="Live Tracking" />

        {/* Mapbox Container */}
        <div
          ref={mapContainer}
          style={{
            position: "absolute",
            top: "64px",
            left: "256px",
            right: 0,
            bottom: 0,
          }}
        />

        {/* Glass Sidebar Panel */}
        <div
          className="glass-panel"
          style={{
            position: "absolute",
            top: "88px",
            left: "280px",
            width: "380px",
            maxHeight: "calc(100vh - 112px)",
            borderRadius: "var(--radius-xl)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          {/* Bus Info Card */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "var(--radius-lg)",
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "28px",
                    color: "white",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  directions_bus
                </span>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    color: "var(--color-on-surface-variant)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.25rem",
                  }}
                >
                  Route 882
                </p>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "var(--color-on-surface)",
                  }}
                >
                  Colombo - Piliyandala
                </h3>
              </div>
            </div>

            {/* Live Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  backgroundColor: "var(--color-surface-container)",
                  padding: "0.75rem",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <div className="live-dot" style={{ width: "6px", height: "6px" }} />
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      color: "var(--color-on-surface-variant)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Speed
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--color-on-surface)",
                  }}
                >
                  {busSpeed} <span style={{ fontSize: "0.875rem" }}>km/h</span>
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "var(--color-surface-container)",
                  padding: "0.75rem",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "14px",
                      color: "var(--color-on-surface-variant)",
                    }}
                  >
                    explore
                  </span>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      color: "var(--color-on-surface-variant)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Bearing
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--color-on-surface)",
                  }}
                >
                  {Math.round(bearing)}°
                </p>
              </div>
            </div>
          </div>

          {/* Stops List */}
          <div>
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--color-on-surface-variant)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.75rem",
              }}
            >
              Route Stops
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {STOPS.map((stop, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "0.75rem",
                    backgroundColor:
                      stop.state === "current"
                        ? "rgba(0, 74, 198, 0.08)"
                        : "var(--color-surface-container)",
                    borderRadius: "var(--radius-lg)",
                    opacity: stop.state === "passed" ? 0.6 : 1,
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor:
                        stop.state === "passed"
                          ? "#16a34a"
                          : stop.state === "current"
                          ? "var(--color-primary)"
                          : "var(--color-surface-container-high)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "16px",
                        color:
                          stop.state === "passed" || stop.state === "current"
                            ? "white"
                            : "var(--color-on-surface-variant)",
                        fontVariationSettings:
                          stop.state === "passed" ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      {stop.state === "passed" ? "check" : "radio_button_unchecked"}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontWeight: 700,
                        color: "var(--color-on-surface)",
                        marginBottom: "0.125rem",
                      }}
                    >
                      {stop.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--color-on-surface-variant)",
                      }}
                    >
                      {stop.time}
                    </p>
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
