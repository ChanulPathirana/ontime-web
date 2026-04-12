import SearchBar from "@/components/SearchBar";
import MapView from "@/components/MapView";
import ETACard from "@/components/ETACard";

export default function PassengerDashboard() {
  return (
    <div className="dashboard">
      <p>Welcome to the transport system</p>

      {/* Search Section */}
      <div className="card">
        <h2>Search Route</h2>
        <SearchBar />
      </div>

      {/* Map Section */}
      <div className="card">
        <h2>Live Bus Tracking</h2>
        <MapView />
      </div>

      {/* ETA Section */}
      <div className="card">
        <h2>Estimated Arrival</h2>
        <ETACard />
      </div>
    </div>
  );
}
