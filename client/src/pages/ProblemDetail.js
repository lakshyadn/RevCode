import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ApproachCard from "../components/ApproachCard";

function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New approach form state
  const [newApproach, setNewApproach] = useState({
    approachName: "",
    codeText: "",
    explanation: "",
  });
  const [adding, setAdding] = useState(false);

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

  const handleNewApproachChange = (field, value) => {
    setNewApproach({ ...newApproach, [field]: value });
  };

  const addApproach = async () => {
    if (!newApproach.approachName || !newApproach.codeText || !newApproach.explanation) {
      alert("Please fill all fields for the new approach.");
      return;
    }
    try {
      setAdding(true);
      const token = localStorage.getItem("token");
      const updatedCode = [...(problem.code || []), newApproach];
      await axios.patch(
        `http://localhost:5000/api/problems/${id}`,
        { code: updatedCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProblem({ ...problem, code: updatedCode });
      setNewApproach({ approachName: "", codeText: "", explanation: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add approach");
    } finally {
      setAdding(false);
    }
  };

  // Toggle starred/bookmark
  const toggleStar = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/problems/${id}`,
        { starred: !problem.starred },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProblem({ ...problem, starred: !problem.starred });
    } catch (err) {
      console.error(err);
      alert("Failed to update starred status");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2>{problem.title}</h2>
        <button
          onClick={toggleStar}
          style={{
            fontSize: 24,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: problem.starred ? "gold" : "#ccc",
          }}
          title={problem.starred ? "Unstar this problem" : "Star this problem"}
        >
          ★
        </button>
      </div>

      {problem.createdAt && (
        <p style={{ color: "#555" }}>
          Added on: {new Date(problem.createdAt).toLocaleString()}
        </p>
      )}

      <p>{problem.description}</p>

      {problem.platformLink && (
        <p>
          <a href={problem.platformLink} target="_blank" rel="noreferrer">
            View on Platform
          </a>
        </p>
      )}

      {/* Show clickable topics */}
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
                cursor: "pointer",
              }}
              onClick={() =>
                window.location.href = `/problems?topic=${encodeURIComponent(topic)}`
              }
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <h3 style={{ marginTop: 30 }}>Approaches</h3>
      {problem.code && problem.code.length > 0 ? (
        problem.code.map((approach, idx) => (
          <ApproachCard
            key={idx}
            index={idx}
            approach={approach}
            onUpdate={async (index, updatedApproach) => {
              const updatedCode = [...problem.code];
              updatedCode[index] = updatedApproach;
              const token = localStorage.getItem("token");
              await axios.patch(
                `http://localhost:5000/api/problems/${id}`,
                { code: updatedCode },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setProblem({ ...problem, code: updatedCode });
            }}
            onDelete={async (index) => {
              if (window.confirm("Are you sure you want to delete this approach?")) {
                const updatedCode = problem.code.filter((_, i) => i !== index);
                const token = localStorage.getItem("token");
                await axios.patch(
                  `http://localhost:5000/api/problems/${id}`,
                  { code: updatedCode },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setProblem({ ...problem, code: updatedCode });
              }
            }}
          />
        ))
      ) : (
        <p>No approaches added yet.</p>
      )}

      {/* Add new approach form */}
      <div style={{ marginTop: 30, borderTop: "1px solid #ccc", paddingTop: 20 }}>
        <h3>Add a New Approach</h3>
        <input
          type="text"
          placeholder="Approach Name"
          value={newApproach.approachName}
          onChange={(e) => handleNewApproachChange("approachName", e.target.value)}
          style={{ width: "100%", marginBottom: 5 }}
        />
        <textarea
          placeholder="Code"
          value={newApproach.codeText}
          onChange={(e) => handleNewApproachChange("codeText", e.target.value)}
          rows={3}
          style={{ width: "100%", marginBottom: 5 }}
        />
        <textarea
          placeholder="Explanation"
          value={newApproach.explanation}
          onChange={(e) => handleNewApproachChange("explanation", e.target.value)}
          rows={2}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <button onClick={addApproach} disabled={adding}>
          {adding ? "Adding..." : "Add Approach"}
        </button>
      </div>
    </div>
  );
}

export default ProblemDetail;
