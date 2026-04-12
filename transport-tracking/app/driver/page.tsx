export default function DriverPage() {
  return (
    <div className="dashboard">
      <h1>Driver Dashboard</h1>

      <div className="card">
        <button className="btn">Start Trip</button>

        <button
          className="btn"
          style={{
            marginLeft: "10px",
            backgroundColor: "red",
          }}
        >
          Stop Trip
        </button>
      </div>
    </div>
  );
}