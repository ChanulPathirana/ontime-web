"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",              icon: "search",         label: "Search Routes"  },
  { href: "/stops",         icon: "near_me",        label: "Nearby Stops"   },
  { href: "/nearby",        icon: "directions_bus", label: "Bus Routes"     },
  { href: "/tracking",      icon: "map",            label: "Live Tracking"  },
  { href: "/notifications", icon: "notifications",  label: "Alerts"         },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <h1>On Time</h1>
        <p>Public Transport</p>
      </div>

      <ul className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link href={item.href} className={`nav-link${isActive ? " active" : ""}`}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    fontSize: "22px",
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>


    </nav>
  );
}
