
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { Medicine } from "@/lib/types";
import { medicines as initialMedicines } from "@/lib/data";

interface MedicineContextType {
  medicines: Medicine[];
  addMedicine: (medicine: Medicine) => void;
}

const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

const getInitialMedicines = (): Medicine[] => {
    if (typeof window === 'undefined') {
        return [];
    }
    try {
        const stored = localStorage.getItem('medicines');
        if (stored) {
            return JSON.parse(stored);
        } else {
            localStorage.setItem('medicines', JSON.stringify(initialMedicines));
            return initialMedicines;
        }
    } catch (error) {
        console.error("Failed to load medicines from localStorage", error);
        localStorage.setItem('medicines', JSON.stringify(initialMedicines));
        return initialMedicines;
    }
};

export function MedicineProvider({ children }: { children: ReactNode }) {
  const [medicines, setMedicines] = useState<Medicine[]>(getInitialMedicines);

  useEffect(() => {
    try {
      localStorage.setItem('medicines', JSON.stringify(medicines));
    } catch (e) {
      console.error("Failed to save medicines to localStorage", e);
    }
  }, [medicines]);

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
