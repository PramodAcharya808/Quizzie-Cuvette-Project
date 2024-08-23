import React from "react";
import "./Dashboard.css";
import { useAuth } from "../../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="container">
      <div className="left-section box-shadow-3 bg-secondary">
        <div className="inner-group-1">
          <h1 className="logo secondary-font"> QUIZZIE</h1>
        </div>

        <div className="inner-group-2">
          <Link to="/dashboard">
            <div className="options">Dashboard</div>
          </Link>

          <Link to="/analytics">
            <div className="options">Analytics</div>
          </Link>

          <Link to="/createquiz">
            <div className="options">Create Quiz</div>
          </Link>
        </div>

        <div className="logout-container">
          <Link to="/" onClick={logout}>
            <div className="logout">LOGOUT</div>
          </Link>
        </div>
      </div>
      <div className="right-section bg-primary"></div>
    </div>
  );
};

export default Dashboard;
