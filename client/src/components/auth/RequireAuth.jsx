// RequireAuth.jsx
import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
}
