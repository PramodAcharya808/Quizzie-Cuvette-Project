import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/LoginSignup";
import Dashboard from "./components/Dashboard/Dashboard";
import { useAuth } from "./context/AuthContext";

function App() {
  const { loggedIn } = useAuth();

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
