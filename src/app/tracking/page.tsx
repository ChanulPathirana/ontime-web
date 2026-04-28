"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";
import {
  BUSES, TRANSIT_ROUTES,
  interpolate, getBearing, splitPath,
  getStopState, stopTimeLabel,
} from "@/lib/transitData";

function TrackingContent() {
  const searchParams = useSearchParams();
  const busId        = searchParams.get("bus") ?? "1";
  const bus          = BUSES[busId] ?? BUSES["1"];
  const route        = TRANSIT_ROUTES[bus.routeId];

  const mapContainer = useRef<HTMLDivElement>(null);
  const map          = useRef<mapboxgl.Map | null>(null);
  const busMarker    = useRef<mapboxgl.Marker | null>(null);
  const progress     = useRef(bus.initProgress);

  const [speed, setSpeed] = useState(42);
  const [prog,  setProg]  = useState(bus.initProgress);

  // ── Map init ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

    const startPos = interpolate(route.path, bus.initProgress);

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: startPos,
      zoom: 14,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.ScaleControl(), "bottom-left");

    map.current.on("load", () => {
      const m = map.current!;

      // Passed segment source (updated each tick)
      m.addSource("passed", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [startPos] } },
      });
      m.addLayer({ id: "passed", type: "line", source: "passed",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#94a3b8", "line-width": 4, "line-opacity": 0.6, "line-dasharray": [2, 2] } });

      // Ahead segment source
      m.addSource("ahead", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: route.path } },
      });
      m.addLayer({ id: "ahead-outline", type: "line", source: "ahead",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ffffff", "line-width": 6, "line-opacity": 0.4 } });
      m.addLayer({ id: "ahead", type: "line", source: "ahead",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": route.color, "line-width": 4 } });

      // Stop markers
      route.stops.forEach((stop, i) => {
        const state = getStopState(i, route.stops.length, progress.current);
        const el    = document.createElement("div");
        el.style.cssText = `width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);background:${state === "passed" ? "#94a3b8" : state === "current" ? route.color : "white"}`;
        el.id = `stop-${i}`;
        new mapboxgl.Marker({ element: el })
          .setLngLat(stop.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 10, closeButton: false }).setText(stop.name))
          .addTo(m);
      });

      // Bus marker
      const busEl = document.createElement("div");
      busEl.style.cssText = "width:40px;height:40px;cursor:pointer";
      busEl.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"
             style="filter:drop-shadow(0 2px 8px rgba(0,0,0,0.35))">
          <circle cx="20" cy="20" r="18" fill="${route.color}"/>
          <rect x="12" y="13" width="16" height="12" rx="2" fill="white"/>
          <rect x="14" y="14" width="4" height="3" rx="1" fill="${route.color}"/>
          <rect x="22" y="14" width="4" height="3" rx="1" fill="${route.color}"/>
          <path d="M20 4 L23 9 L20 7.5 L17 9 Z" fill="white" opacity="0.9"/>
        </svg>`;
      busMarker.current = new mapboxgl.Marker({ element: busEl, rotationAlignment: "map", pitchAlignment: "map" })
        .setLngLat(startPos)
        .addTo(m);
    });

    return () => { map.current?.remove(); map.current = null; };
  // eslint-disable name/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busId]);

  // ── Animation loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      progress.current = (progress.current + 0.0035) % 1;
      const p   = progress.current;
      const pos = interpolate(route.path, p);
      const brg = getBearing(route.path, p);

      busMarker.current?.setLngLat(pos);
      busMarker.current?.setRotation(brg);
      map.current?.flyTo({ center: pos, zoom: map.current.getZoom(), duration: 200 });

      // Update route split
      if (map.current?.isStyleLoaded()) {
        const { passed, ahead } = splitPath(route.path, p);
        (map.current.getSource("passed") as mapboxgl.GeoJSONSource)?.setData(
          { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: passed } }
        );
        (map.current.getSource("ahead") as mapboxgl.GeoJSONSource)?.setData(
          { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: ahead } }
        );
      }

      setSpeed(Math.floor(36 + Math.random() * 18));
      setProg(p);
    }, 100);

    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busId]);

  const eta = Math.max(1, Math.round((1 - prog) * 28));

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content" style={{ overflow: "hidden", height: "100vh", position: "relative" }}>
        <TopAppBar title="Live Tracking" />

        <div ref={mapContainer} style={{ position: "absolute", inset: 0, top: 64, zIndex: 0 }} />

        {/* Info panel */}
        <div className="glass-panel" style={{ position: "absolute", top: 88, left: 280, width: 360, maxHeight: "calc(100vh - 112px)", borderRadius: "var(--radius-xl)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", overflowY: "auto", zIndex: 10 }}>

          {/* Bus header */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: 52, height: 52, borderRadius: "var(--radius-lg)", background: route.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: "white", fontVariationSettings: "'FILL' 1" }}>directions_bus</span>
            </div>
            <div>
              <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
                Route {bus.number} · <span style={{ color: bus.status === "active" ? "#16a34a" : "#ef4444" }}>{bus.status === "active" ? "On Time" : "Delayed"}</span>
              </p>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-on-surface)" }}>{route.name}</h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-on-surface-variant)", marginTop: 2 }}>Driver: {bus.driverName}</p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.625rem" }}>
            {[
              { label: "ETA",     value: `${eta} min`, icon: "schedule"  },
              { label: "Speed",   value: `${speed} km/h`, icon: "speed"  },
              { label: "Load",    value: `${bus.occupancyPct}%`, icon: "groups" },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ background: "var(--color-surface-container)", padding: "0.75rem", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--color-on-surface-variant)" }}>{icon}</span>
                <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0.25rem 0 0.125rem" }}>{value}</p>
                <p style={{ fontSize: "0.625rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Stops list */}
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>Route Stops</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {route.stops.map((stop, i) => {
                const state = getStopState(i, route.stops.length, prog);
                const label = stopTimeLabel(i, route.stops.length, prog);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", padding: "0.75rem",
                    background: state === "current" ? `${route.color}12` : "var(--color-surface-container)",
                    borderRadius: "var(--radius-lg)", opacity: state === "passed" ? 0.5 : 1,
                    borderLeft: state === "current" ? `3px solid ${route.color}` : "3px solid transparent" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      background: state === "passed" ? "#94a3b8" : state === "current" ? route.color : "var(--color-surface-container-high)" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 15, color: state === "upcoming" ? "var(--color-on-surface-variant)" : "white", fontVariationSettings: state === "passed" ? "'FILL' 1" : "'FILL' 0" }}>
                        {state === "passed" ? "check" : "radio_button_unchecked"}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--color-on-surface)", marginBottom: 2 }}>{stop.name}</p>
                      <p style={{ fontSize: "0.8125rem", color: "var(--color-on-surface-variant)" }}>{label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>Loading map…</div>}>
      <TrackingContent />
    </Suspense>
  );
}
