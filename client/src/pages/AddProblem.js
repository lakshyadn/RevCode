import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProblem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platformLink, setPlatformLink] = useState("");
  const [topics, setTopics] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/problems",
        {
          title,
          description,
          platformLink,
          topics: topics.split(",").map((t) => t.trim()),
          code: [] // for now, no code approaches
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Problem added!");
      navigate("/problems");
    } catch (err) {
      console.error(err);
      alert("Failed to add problem");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto" }}>
      <h2>Add New Problem</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Problem Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="Platform Link (optional)"
            value={platformLink}
            onChange={(e) => setPlatformLink(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="Topics (comma separated)"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
          />
        </div>
        <button type="submit" style={{ marginTop: 20 }}>
          Add Problem
        </button>
      </form>
    </div>
  );
}

export default AddProblem;
