import React, { createContext, useContext, useRef, useState } from "react";

const ScrollContext = createContext();

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollContext must be used within a ScrollProvider");
  }
  return context;
};

export const ScrollProvider = ({ children }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetScrollProgress = useRef(0);

  const navigateToPosition = (position) => {
    targetScrollProgress.current = Math.max(0, Math.min(1, position));
  };

  const value = {
    scrollProgress,
    setScrollProgress,
    targetScrollProgress,
    navigateToPosition,
  };

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
};
