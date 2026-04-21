"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", icon: "route", label: "Routes" },
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/tracking", icon: "map", label: "Map/Tracking" },
  { href: "/nearby", icon: "directions_bus", label: "Nearby Buses" },
  { href: "/driver", icon: "airport_shuttle", label: "Driver Status" },
  { href: "/notifications", icon: "notifications", label: "Notifications" },
  { href: "/profile", icon: "person", label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <h1>Transit Flow</h1>
        <p>Public Transport System</p>
      </div>

      <ul className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`nav-link${isActive ? " active" : ""}`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: isActive
                      ? "'FILL' 1, 'wght' 400"
                      : "'FILL' 0, 'wght' 400",
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

      <div className="sidebar-footer">
        <Link href="/logout" className="nav-link">
          <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
            logout
          </span>
          <span>Logout</span>
        </Link>
      </div>
    </nav>
  );
}
