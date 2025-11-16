
"use client";

import React, { createContext, useContext, useState } from "react";

type AdminSearchContextType = {
  query: string;
  setQuery: (q: string) => void;
};

const AdminSearchContext = createContext<AdminSearchContextType | undefined>(undefined);

export function AdminSearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  return (
    <AdminSearchContext.Provider value={{ query, setQuery }}>
      {children}
    </AdminSearchContext.Provider>
  );
}

export function useAdminSearch() {
  const ctx = useContext(AdminSearchContext);
  if (!ctx) throw new Error("useAdminSearch must be used within AdminSearchProvider");
  return ctx;
}
