import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TOPICS = ["Arrays", "Strings", "Binary Search", "Hashmap", "Linked List", "Trees", "BST", "Dynamic Programming", "Graph"];

function AddProblem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platformLink, setPlatformLink] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [approaches, setApproaches] = useState([
    { approachName: "", codeText: "", explanation: "" },
  ]);

  const navigate = useNavigate();

  const handleTopicChange = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleApproachChange = (index, field, value) => {
    const newApproaches = [...approaches];
    newApproaches[index][field] = value;
    setApproaches(newApproaches);
  };

  const addApproach = () => {
    setApproaches([...approaches, { approachName: "", codeText: "", explanation: "" }]);
  };

  const removeApproach = (index) => {
    setApproaches(approaches.filter((_, i) => i !== index));
  };

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
          topics: selectedTopics,
          code: approaches,
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

        {/* Topics */}
        <div style={{ marginTop: 10 }}>
          <label>Choose Topics:</label>
          <div>
            {TOPICS.map((topic) => (
              <label key={topic} style={{ marginRight: 10 }}>
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic)}
                  onChange={() => handleTopicChange(topic)}
                />
                {topic}
              </label>
            ))}
          </div>
        </div>

        {/* Approaches */}
        <div style={{ marginTop: 20 }}>
          <h3>Approaches</h3>
          {approaches.map((approach, index) => (
            <div key={index} style={{ marginBottom: 10, border: "1px solid #ccc", padding: 10 }}>
              <input
                type="text"
                placeholder="Approach Name"
                value={approach.approachName}
                onChange={(e) => handleApproachChange(index, "approachName", e.target.value)}
                required
              />
              <textarea
                placeholder="Code"
                value={approach.codeText}
                onChange={(e) => handleApproachChange(index, "codeText", e.target.value)}
                rows={3}
                style={{ width: "100%", marginTop: 5 }}
                required
              />
              <textarea
                placeholder="Explanation"
                value={approach.explanation}
                onChange={(e) => handleApproachChange(index, "explanation", e.target.value)}
                rows={2}
                style={{ width: "100%", marginTop: 5 }}
                required
              />
              <button type="button" onClick={() => removeApproach(index)} style={{ marginTop: 5 }}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addApproach}>
            Add Another Approach
          </button>
        </div>

        <button type="submit" style={{ marginTop: 20 }}>
          Add Problem
        </button>
      </form>
    </div>
  );
}

export default AddProblem;
