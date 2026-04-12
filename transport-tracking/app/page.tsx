import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <h1 className="title">Public Transport Tracking System</h1>

      <div className="button-group">
        <Link href="/dashboard" className="btn">
          Passenger
        </Link>
        <Link href="/driver" className="btn">
          Driver
        </Link>
        <Link href="/admin" className="btn">
          Admin
        </Link>
      </div>
    </div>
  );
}
