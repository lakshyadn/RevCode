import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <h2>Welcome to RevCode Dashboard</h2>

      <div style={{ marginTop: 20 }}>
        <Link to="/add-problem">
          <button>Add New Problem</button>
        </Link>
        <Link to="/problems" style={{ marginLeft: 10 }}>
          <button>View Problems</button>
        </Link>
      </div>

      <p style={{ marginTop: 20 }}>
        Here you’ll see an overview of your DSA problems, stats, and shortcuts to filter by topics.
      </p>
    </div>
  );
}

export default Dashboard;
