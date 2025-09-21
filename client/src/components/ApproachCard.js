// src/components/ApproachCard.js
import React from "react";

function ApproachCard({ approach }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
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
    </div>
  );
}

export default ApproachCard;
