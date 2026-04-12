export default function AdminPage() {
  return (
    <div className="dashboard">
      <h1>Admin Panel</h1>

      {/* Section: Manage Buses */}
      <div className="card">
        <h2>Bus Management</h2>
        <p>Add, update, or remove buses from the system.</p>
        <button className="btn">Add Bus</button>
      </div>

      {/* Section: Manage Routes */}
      <div className="card">
        <h2>Route Management</h2>
        <p>Create and manage transport routes.</p>
        <button className="btn">Add Route</button>
      </div>

      {/* Section: Users */}
      <div className="card">
        <h2>User Management</h2>
        <p>View and manage passengers and drivers.</p>
        <button className="btn">View Users</button>
      </div>

      {/* Section: Analytics */}
      <div className="card">
        <h2>System Analytics</h2>
        <p>View system performance and usage statistics.</p>
        <button className="btn">View Reports</button>
      </div>
    </div>
  );
}
