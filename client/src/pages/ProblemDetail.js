import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // ✅ import Link
import axios from "axios";
import ApproachCard from "../components/ApproachCard";

function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/problems/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProblem(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <h2>{problem.title}</h2>
      <p>{problem.description}</p>
      <p>
        <a href={problem.platformLink} target="_blank" rel="noreferrer">
          View on Platform
        </a>
      </p>

      {/* ✅ Show clickable topics */}
      {problem.topics && problem.topics.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <strong>Topics:</strong>{" "}
          {problem.topics.map((topic, idx) => (
            <span
              key={idx}
              style={{
                marginRight: 8,
                padding: "3px 8px",
                background: "#f0f0f0",
                borderRadius: "5px",
              }}
            >
              <Link
                to={`/problems/topic/${topic}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                {topic}
              </Link>
            </span>
          ))}
        </div>
      )}

      <h3 style={{ marginTop: 30 }}>Approaches</h3>
      {problem.code && problem.code.length > 0 ? (
        problem.code.map((approach, index) => (
          <ApproachCard key={index} approach={approach} />
        ))
      ) : (
        <p>No approaches added yet.</p>
      )}
    </div>
  );
}

export default ProblemDetail;
