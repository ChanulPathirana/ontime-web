"use client";

import Link from "next/link";

export default function SideBar() {
  return (
    <div className="sidebar">
      <h2>Transport</h2>

      <Link href="/dashboard">Dashboard</Link>
      <Link href="/dashboard/map">Live Map</Link>
      <Link href="/dashboard/routes">Routes</Link>
      <Link href="/dashboard/eta">ETA</Link>

      <hr style={{ margin: "20px 0", borderColor: "#90a3be" }} />


      <Link href="/driver">Driver</Link>
      <Link href="/admin">Admin</Link>
    </div>
  );
}