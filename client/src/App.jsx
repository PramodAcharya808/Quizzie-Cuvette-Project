import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/LoginSignup";
import Dashboard from "./components/dashboard/mainDashboard/Dashboard";
import { useAuth } from "./context/AuthContext";
import Analytics from "./components/dashboard/analytics/allAnalytics/Analytics";
import CreateQuiz from "./components/dashboard/createQuiz/CreateQuiz";

function App() {
  const { loggedIn } = useAuth();
  console.log("Authenticated: ", loggedIn);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={!loggedIn ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={loggedIn ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/analytics"
          element={loggedIn ? <Analytics /> : <Navigate to="/" />}
        />

        <Route
          path="/createquiz"
          element={loggedIn ? <CreateQuiz /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
