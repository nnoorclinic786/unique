
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Medicine } from "@/lib/types";
import { medicines as initialMedicines } from "@/lib/data";

interface MedicineContextType {
  medicines: Medicine[];
  addMedicine: (medicine: Medicine) => void;
}

const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

export function MedicineProvider({ children }: { children: ReactNode }) {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);

  const addMedicine = (medicine: Medicine) => {
    setMedicines((prevMedicines) => [...prevMedicines, medicine]);
  };

  return (
    <MedicineContext.Provider value={{ medicines, addMedicine }}>
      {children}
    </MedicineContext.Provider>
  );
}

export function useMedicineContext() {
  const context = useContext(MedicineContext);
  if (context === undefined) {
    throw new Error("useMedicineContext must be used within a MedicineProvider");
  }
  return context;
}
