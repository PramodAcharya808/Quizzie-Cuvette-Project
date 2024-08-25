import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/LoginSignup";
import Dashboard from "./components/dashboard/mainDashboard/Dashboard";
import { useAuth } from "./context/AuthContext";
import Analytics from "./components/dashboard/analytics/allAnalytics/Analytics";
import CreateQuiz from "./components/dashboard/createQuiz/CreateQuiz";
import NotFound from "./components/404/NotFound ";
import QuestionAnalytics from "./components/dashboard/analytics/questionWiseAnalytics/QuestionAnalytics";
import PollWiseAnalytics from "./components/dashboard/analytics/pollWiseAnalysis/PollWiseAnalytics";

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
          <Route path="analytics" element={<Analytics />} />
          <Route
            path="questionanalytics/:quizId"
            element={<QuestionAnalytics />}
          />
          <Route
            path="getpollanalytics/:quizId"
            element={<PollWiseAnalytics />}
          />
          <Route path="createquiz" element={<CreateQuiz />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
