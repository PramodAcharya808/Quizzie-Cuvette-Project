import React, { createContext, useContext, useState } from "react";

const loaderContext = createContext(null);
export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <loaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </loaderContext.Provider>
  );
};

export const useLoader = () => useContext(loaderContext);
