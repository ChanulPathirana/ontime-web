"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",              icon: "search",         label: "Search"  },
  { href: "/stops",         icon: "near_me",        label: "Stops"   },
  { href: "/nearby",        icon: "directions_bus", label: "Routes"  },
  { href: "/tracking",      icon: "map",            label: "Track"   },
  { href: "/notifications", icon: "notifications",  label: "Alerts"  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item${isActive ? " active" : ""}`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "22px",
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
