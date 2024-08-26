import React, { createContext, useContext, useEffect, useState } from "react";
import { isAuthenticated } from "./auth";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(() => isAuthenticated());
  const [loading, setLoading] = useState(false);

  const setLoadingState = (state) => {
    setLoading(state);
  };

  const login = (token) => {
    document.cookie = `accessToken=${token.accessToken}; path=/`;
    document.cookie = `refreshToken=${token.refreshToken}; path=/`;
    setLoggedIn(true);
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:8000/api/v1/user/logout");
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
    const recheckAuthentication = () => {
      const isAuthenticatedResult = isAuthenticated();
      setLoggedIn(isAuthenticatedResult);
    };

    recheckAuthentication();
  }, []);

  const notifyQuizCreated = () => {
    setQuizCreated(true);
    setTimeout(() => setQuizCreated(false), 1000);
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        login,
        logout,
        loading,
        setLoadingState,
        notifyQuizCreated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
