import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const topic = searchParams.get("topic"); // get topic from query string

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/problems", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let filtered = res.data;
        if (topic) {
          filtered = filtered.filter((p) => p.topics.includes(topic));
        }

        // Sort by newest first
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setProblems(filtered);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [topic]);

  const clearFilter = () => {
    setSearchParams({}); // clears query string
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <h2>{topic ? `Problems on ${topic}` : "Your Problems"}</h2>

      {topic && (
        <button 
          onClick={clearFilter} 
          style={{ marginBottom: 10, padding: "5px 10px", cursor: "pointer" }}
        >
          Clear filter
        </button>
      )}

      {problems.length === 0 ? (
        <p>No problems found.</p>
      ) : (
        problems.map((p) => (
          <div key={p._id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
            <Link to={`/problems/${p._id}`}><h3>{p.title}</h3></Link>
            <p>{p.description}</p>
            <p>
              <strong>Topics:</strong>{" "}
              {p.topics.map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    marginRight: 8,
                    padding: "3px 8px",
                    background: "#f0f0f0",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                  onClick={() => setSearchParams({ topic: t })}
                >
                  {t}
                </span>
              ))}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default ProblemList;
