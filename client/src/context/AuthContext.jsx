import React, { createContext, useContext, useEffect, useState } from "react";
import { isAuthenticated } from "./auth";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const login = (token) => {
    console.log(token);
    document.cookie = `accessToken=${token.accessToken}; path=/`;
    document.cookie = `refreshToken=${token.refreshToken}; path=/`;
    setLoggedIn(true);
  };

  const logout = async () => {
    try {
      // Call the logout API
      await axios.post("http://localhost:8000/api/v1/user/logout");
      // Clear the authentication state client-side
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
