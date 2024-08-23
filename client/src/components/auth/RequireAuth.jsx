// RequireAuth.jsx
import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const { user } = useAuth();

  if (!user || !user.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
}
