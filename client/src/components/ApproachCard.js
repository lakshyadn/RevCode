import React from "react";

function ApproachCard({ approach }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "5px",
      padding: "10px",
      marginBottom: "10px"
    }}>
      <h4>{approach.approachName}</h4>
      <pre style={{ background: "#f9f9f9", padding: "10px", borderRadius: "5px" }}>
        {approach.codeText}
      </pre>
      <p>{approach.explanation}</p>
    </div>
  );
}

export default ApproachCard;
