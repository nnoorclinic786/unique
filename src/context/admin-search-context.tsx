"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdminSearchContextType {
  query: string;
  setQuery: (q: string) => void;
}

const AdminSearchContext = createContext<AdminSearchContextType | undefined>(undefined);

export function AdminSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");

  return (
    <AdminSearchContext.Provider value={{ query, setQuery }}>
      {children}
    </AdminSearchContext.Provider>
  );
}

export function useAdminSearch() {
  const context = useContext(AdminSearchContext);
  if (context === undefined) {
    throw new Error("useAdminSearch must be used within an AdminSearchProvider");
  }
  return context;
}
