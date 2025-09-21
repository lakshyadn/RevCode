import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddProblem from "./pages/AddProblem";
import ProblemList from "./pages/ProblemList";
import ProblemDetail from "./pages/ProblemDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-problem" element={<AddProblem />} />
        <Route path="/problems" element={<ProblemList />} />
        {/* ✅ Topic route before id route */}
        <Route path="/problems/topic/:topic" element={<ProblemList />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
