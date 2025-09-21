import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(""); // search box
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const topic = searchParams.get("topic"); // topic filter

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/problems", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let data = res.data;

        // Topic filter
        if (topic) data = data.filter((p) => p.topics.includes(topic));

        // Starred filter
        if (showStarredOnly) data = data.filter((p) => p.starred);

        // Sort: starred first, then newest
        data.sort((a, b) => {
          if (a.starred && !b.starred) return -1;
          if (!a.starred && b.starred) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setProblems(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [topic, showStarredOnly]);

  const clearFilter = () => {
    setSearchParams({});
    setSearchQuery("");
  };

  const toggleStarredFilter = () => setShowStarredOnly(!showStarredOnly);

  // Toggle star for a problem
  const toggleStar = async (problemId, currentStarred) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/api/problems/${problemId}`,
        { starred: !currentStarred },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProblems(problems.map(p =>
        p._id === problemId ? { ...p, starred: res.data.starred } : p
      ));
    } catch (err) {
      console.error("Failed to toggle star", err);
    }
  };

  // Filter based on search box
  const filteredProblems = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <h2>{topic ? `Problems on ${topic}` : "Your Problems"}</h2>

      {/* Filter buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        {topic && (
          <button onClick={clearFilter} style={{ padding: "5px 10px", cursor: "pointer" }}>
            Clear topic filter
          </button>
        )}
        <button onClick={toggleStarredFilter} style={{ padding: "5px 10px", cursor: "pointer" }}>
          {showStarredOnly ? "Show All Problems" : "Show Starred Only"}
        </button>
      </div>

      {/* Search box */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search problems by title or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      {filteredProblems.length === 0 ? (
        <p>No problems found.</p>
      ) : (
        filteredProblems.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginTop: 10,
              position: "relative",
            }}
          >
            <Link to={`/problems/${p._id}`}>
              <h3>{p.title}</h3>
            </Link>
            <p>{p.description}</p>

            {/* Star / bookmark */}
            <span
              style={{
                cursor: "pointer",
                color: p.starred ? "gold" : "#ccc",
                fontSize: "1.2em",
                position: "absolute",
                top: 10,
                right: 10,
              }}
              onClick={() => toggleStar(p._id, p.starred)}
            >
              ★
            </span>

            {/* Topics */}
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
                    cursor: "pointer",
                  }}
                  onClick={() => setSearchParams({ topic: t })}
                >
                  {t}
                </span>
              ))}
            </p>

            {/* Created date */}
            {p.createdAt && (
              <p style={{ color: "#555", fontSize: "0.9em" }}>
                Added on: {new Date(p.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ProblemList;
