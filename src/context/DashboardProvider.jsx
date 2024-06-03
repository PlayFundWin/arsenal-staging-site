// DashboardProvider.jsx
import React, { useState, createContext, useContext } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [page, setPage] = useState(1);

  return <DashboardContext.Provider value={{ page, setPage }}>{children}</DashboardContext.Provider>;
}

export const useDashboard = () => useContext(DashboardContext);
