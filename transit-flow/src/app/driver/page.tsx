"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";

type DriverStatus =
  | "taken_bus"
  | "at_bus_stand"
  | "active_on_road"
  | "break"
  | "continue"
  | "arrived";

interface StatusOption {
  id: DriverStatus;
  icon: string;
  label: string;
  variant: "complete" | "active" | "inactive";
}

const STATUS_OPTIONS: StatusOption[] = [
  { id: "taken_bus", icon: "directions_transit", label: "Taken the Bus", variant: "complete" },
  { id: "at_bus_stand", icon: "storefront", label: "At Bus Stand", variant: "complete" },
  { id: "active_on_road", icon: "airport_shuttle", label: "Active on Road", variant: "active" },
  { id: "break", icon: "local_cafe", label: "Break", variant: "inactive" },
  { id: "continue", icon: "play_arrow", label: "Continue", variant: "inactive" },
  { id: "arrived", icon: "flag", label: "Arrived", variant: "inactive" },
];

export default function DriverStatusPage() {
  const [activeStatus, setActiveStatus] = useState<DriverStatus>("active_on_road");

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <TopAppBar title="Driver Status" />

        <div
          className="page-enter"
          style={{
            paddingTop: "88px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            paddingBottom: "3rem",
            maxWidth: "960px",
            margin: "0 auto",
          }}
        >
          {/* Page Header */}
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "2.25rem",
                fontWeight: 800,
                color: "var(--color-on-surface)",
                letterSpacing: "-0.02em",
                marginBottom: "0.375rem",
              }}
            >
              Status Update
            </h2>
            <p style={{ color: "var(--color-on-surface-variant)", fontWeight: 500 }}>
              Log your current operational state.
            </p>
          </div>

          {/* Trip Summary Card */}
          <div
            className="card-lg"
            style={{
              padding: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "2rem",
              position: "relative",
              overflow: "hidden",
              flexWrap: "wrap",
            }}
          >
            {/* Decorative blur blob */}
            <div
              style={{
                position: "absolute",
                top: "-6rem",
                left: "-6rem",
                width: "16rem",
                height: "16rem",
                backgroundColor: "rgba(0, 74, 198, 0.05)",
                borderRadius: "50%",
                filter: "blur(48px)",
                pointerEvents: "none",
              }}
            />

            {/* Route Info */}
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--color-surface-container)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "32px",
                    color: "var(--color-primary)",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  directions_bus
                </span>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--color-on-surface-variant)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.25rem",
                  }}
                >
                  Current Trip
                </p>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--color-on-surface)",
                  }}
                >
                  Route: 101-A
                </h3>
              </div>
            </div>

            {/* Next Stop */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                backgroundColor: "var(--color-surface)",
                padding: "1rem 1.5rem",
                borderRadius: "var(--radius-lg)",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-secondary-container)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px", color: "var(--color-on-secondary-container)" }}
                >
                  place
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
                    marginBottom: "0.125rem",
                  }}
                >
                  Next Stop
                </p>
                <p
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "var(--color-on-surface)",
                  }}
                >
                  City Hall
                </p>
              </div>
            </div>
          </div>

          {/* Status Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            {STATUS_OPTIONS.map((option) => {
              const isSelected = activeStatus === option.id;

              if (option.variant === "active") {
                return (
                  <button
                    key={option.id}
                    onClick={() => setActiveStatus(option.id)}
                    style={{
                      background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)",
                      borderRadius: "var(--radius-xl)",
                      padding: "1.5rem",
                      display: "flex",
                      flexDirection: "column",
                      height: "10rem",
                      justifyContent: "space-between",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: "var(--shadow-ambient)",
                      outline: isSelected ? "4px solid rgba(37, 99, 235, 0.3)" : "none",
                      outlineOffset: "2px",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {/* Live pulse indicator */}
                    <div
                      style={{
                        position: "absolute",
                        top: "1.5rem",
                        right: "1.5rem",
                        width: "12px",
                        height: "12px",
                      }}
                    >
                      <div
                        className="live-dot"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.9)",
                          width: "10px",
                          height: "10px",
                        }}
                      />
                    </div>
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "32px",
                        color: "var(--color-on-primary)",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      {option.icon}
                    </span>
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.6875rem",
                          color: "var(--color-primary-fixed-dim)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Current Status
                      </span>
                      <span
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: 700,
                          color: "var(--color-on-primary)",
                        }}
                      >
                        {option.label}
                      </span>
                    </div>
                  </button>
                );
              }

              if (option.variant === "complete") {
                return (
                  <button
                    key={option.id}
                    onClick={() => setActiveStatus(option.id)}
                    className="status-card status-card-muted status-card-complete"
                    style={{
                      outline: isSelected ? "2px solid var(--color-success)" : "none",
                      outlineOffset: "2px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        width: "100%",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: "32px",
                          color: "var(--color-on-surface-variant)",
                        }}
                      >
                        {option.icon}
                      </span>
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(22, 163, 74, 0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: "14px",
                            color: "#16a34a",
                            fontVariationSettings: "'FILL' 1",
                          }}
                        >
                          check
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "var(--color-on-surface)",
                      }}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={option.id}
                  onClick={() => setActiveStatus(option.id)}
                  className="status-card status-card-inactive"
                  style={{
                    outline: isSelected
                      ? "2px solid var(--color-primary)"
                      : "none",
                    outlineOffset: "2px",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "32px",
                      color: isSelected
                        ? "var(--color-primary)"
                        : "var(--color-on-surface-variant)",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {option.icon}
                  </span>
                  <span
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "var(--color-on-surface)",
                    }}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
