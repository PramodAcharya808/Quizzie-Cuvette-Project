import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/LoginSignup";
import Dashboard from "./components/dashboard/mainDashboard/Dashboard";
import { useAuth } from "./context/AuthContext";
import Analytics from "./components/dashboard/analytics/allAnalytics/Analytics";
import CreateQuiz from "./components/dashboard/createQuiz/CreateQuiz";
import NotFound from "./components/404/NotFound ";

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
        >
          <Route path="createquiz" element={<CreateQuiz />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
