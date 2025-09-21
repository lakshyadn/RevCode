import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const { topic } = useParams();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/problems", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (topic) {
          setProblems(res.data.filter((p) => p.topics.includes(topic)));
        } else {
          setProblems(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProblems();
  }, [topic]);

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <h2>{topic ? `Problems on ${topic}` : "Your Problems"}</h2>
      {problems.length === 0 ? (
        <p>No problems found.</p>
      ) : (
        problems.map((p) => (
          <div
            key={p._id}
            style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}
          >
            <Link to={`/problems/${p._id}`}>
              <h3>{p.title}</h3>
            </Link>
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
