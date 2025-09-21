import React, { useState } from "react";

function ApproachCard({ approach, index, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editApproach, setEditApproach] = useState({ ...approach });

  const handleChange = (field, value) => {
    setEditApproach({ ...editApproach, [field]: value });
  };

  const saveEdit = () => {
    onUpdate(index, editApproach);
    setIsEditing(false);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editApproach.approachName}
            onChange={(e) => handleChange("approachName", e.target.value)}
            style={{ width: "100%", marginBottom: 5 }}
          />
          <textarea
            rows={3}
            style={{ width: "100%", marginBottom: 5 }}
            value={editApproach.codeText}
            onChange={(e) => handleChange("codeText", e.target.value)}
          />
          <textarea
            rows={2}
            style={{ width: "100%", marginBottom: 5 }}
            value={editApproach.explanation}
            onChange={(e) => handleChange("explanation", e.target.value)}
          />
          <button onClick={saveEdit} style={{ marginRight: 5 }}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h4>{approach.approachName}</h4>
          <pre
            style={{
              background: "#f5f5f5",
              padding: 10,
              overflowX: "auto",
            }}
          >
            {approach.codeText}
          </pre>
          <p>{approach.explanation}</p>
          <button onClick={() => setIsEditing(true)} style={{ marginRight: 5 }}>Edit</button>
          <button onClick={() => onDelete(index)}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default ApproachCard;
