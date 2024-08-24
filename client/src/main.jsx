import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { LoaderProvider } from "./context/LoaderContext";

createRoot(document.getElementById("root")).render(
  <LoaderProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </LoaderProvider>
);
