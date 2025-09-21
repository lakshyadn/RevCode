import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ProblemList() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/problems", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProblems(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <h2>Your Problems</h2>
      {problems.length === 0 ? (
        <p>No problems added yet.</p>
      ) : (
        problems.map((p) => (
          <div key={p._id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
            <Link to={`/problems/${p._id}`}><h3>{p.title}</h3></Link>
            <p>{p.description}</p>
            <p>
              <strong>Topics:</strong> {p.topics.join(", ")}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default ProblemList;
