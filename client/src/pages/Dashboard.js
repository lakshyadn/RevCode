// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFF", "#FF6699"];

function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/problems", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProblems(res.data);
      } catch (err) {
        console.error("Failed to fetch problems", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  // ---- Analytics calculations ----

  // Problems per Topic
  const topicCount = {};
  problems.forEach(p => {
    (p.topics || []).forEach(t => {
      topicCount[t] = (topicCount[t] || 0) + 1;
    });
  });
  const topicsData = Object.keys(topicCount).map(topic => ({ topic, count: topicCount[topic] }));

  // Problems per Platform (extract domain from platformLink)
  const platformCount = {};
  problems.forEach(p => {
    let platform = "Unknown";
    if (p.platformLink) {
      try {
        const url = new URL(p.platformLink);
        platform = url.hostname.replace("www.", "");
      } catch {}
    }
    platformCount[platform] = (platformCount[platform] || 0) + 1;
  });
  const platformsData = Object.keys(platformCount).map(p => ({ platform: p, count: platformCount[p] }));

  // Problems Added Over Time (group by month-year)
  const dateCount = {};
  problems.forEach(p => {
    const date = new Date(p.createdAt);
    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
    dateCount[monthYear] = (dateCount[monthYear] || 0) + 1;
  });
  const dateData = Object.keys(dateCount).sort().map(d => ({ date: d, count: dateCount[d] }));


  // Problems Added Over Time (group by day)
const dayCount = {};
problems.forEach(p => {
  const date = new Date(p.createdAt);
  // Format as YYYY-MM-DD
  const day = date.toISOString().split("T")[0];
  dayCount[day] = (dayCount[day] || 0) + 1;
});

// Convert to array and sort by date
const dayData = Object.keys(dayCount)
  .map(d => ({ date: d, count: dayCount[d] }))
  .sort((a, b) => new Date(a.date) - new Date(b.date));



  // Problems with Multiple Approaches
  const multiApproachCount = problems.filter(p => (p.code || []).length > 1).length;
  const singleApproachCount = problems.length - multiApproachCount;
  const approachData = [
    { name: "Single Approach", count: singleApproachCount },
    { name: "Multiple Approaches", count: multiApproachCount },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "50px auto" }}>
      <h2>Welcome to RevCode Dashboard</h2>

      <div style={{ marginTop: 20 }}>
        <Link to="/add-problem">
          <button>Add New Problem</button>
        </Link>
        <Link to="/problems" style={{ marginLeft: 10 }}>
          <button>View Problems</button>
        </Link>
      </div>

      <p style={{ marginTop: 20 }}>
        Here you’ll see an overview of your DSA problems, stats, and shortcuts to filter by topics.
      </p>

      {/* Analytics */}
      <h3 style={{ marginTop: 40 }}>Analytics</h3>

      {/* Problems per Topic */}
      <div style={{ marginTop: 20 }}>
        <h4>Problems per Topic</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topicsData}>
            <XAxis
              dataKey="topic"
              interval={0}
              tick={({ x, y, payload }) => {
                const words = payload.value.split(" "); // split by space
                return (
                  <g transform={`translate(${x},${y + 10})`}>
                    {words.map((word, index) => (
                      <text
                        key={index}
                        x={0}
                        y={index * 12} // line height
                        textAnchor="middle"
                        fontSize={12}
                      >
                        {word}
                      </text>
                    ))}
                  </g>
                );
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Problems per Platform */}
      <div style={{ marginTop: 40 }}>
        <h4>Problems per Platform</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={platformsData}
              dataKey="count"
              nameKey="platform"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {platformsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Problems Added Over Time */}
      <div style={{ marginTop: 40 }}>
        <h4>Problems Added Over Time</h4>
        <ResponsiveContainer width="100%" height={250}>
  <LineChart data={dayData}>
    <XAxis
      dataKey="date"
      angle={-45}
      textAnchor="end"
      interval={0}
      tick={{ fontSize: 1 }}
    />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="count" stroke="#82ca9d" />
  </LineChart>
</ResponsiveContainer>
      </div>

      {/* Problems with Multiple Approaches */}
      <div style={{ marginTop: 40 }}>
        <h4>Problems with Multiple Approaches</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={approachData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
