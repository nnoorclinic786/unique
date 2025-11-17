
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { Buyer } from "@/lib/types";
import { buyers as initialBuyersData } from "@/lib/data";

interface BuyerContextType {
  buyers: Buyer[];
  pendingBuyers: Buyer[];
  disabledBuyers: Buyer[];
  addPendingBuyer: (buyer: Buyer) => void;
  approveBuyer: (buyerId: string) => void;
  toggleBuyerStatus: (buyerId: string, status: 'Approved' | 'Disabled') => void;
}

const BuyerContext = createContext<BuyerContextType | undefined>(undefined);

export function BuyerProvider({ children }: { children: ReactNode }) {
  const [allBuyers, setAllBuyers] = useState<Buyer[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('buyers');
      if (stored) {
        setAllBuyers(JSON.parse(stored));
      } else {
        localStorage.setItem('buyers', JSON.stringify(initialBuyersData));
        setAllBuyers(initialBuyersData);
      }
    } catch (e) {
      console.error("Failed to process buyers from localStorage", e);
      setAllBuyers(initialBuyersData);
    }
  }, []);

  useEffect(() => {
    // Only write to storage if there is something to write and we're on the client
    if (allBuyers.length > 0 && typeof window !== 'undefined') {
      try {
        localStorage.setItem('buyers', JSON.stringify(allBuyers));
      } catch (e) {
        console.error("Failed to save buyers to localStorage", e);
      }
    }
  }, [allBuyers]);

  const addPendingBuyer = (buyer: Buyer) => {
    setAllBuyers((prev) => [...prev, buyer]);
  };
  
  const approveBuyer = (buyerId: string) => {
    setAllBuyers(prev => prev.map(b => b.id === buyerId ? { ...b, status: 'Approved' } : b));
  };

  const toggleBuyerStatus = (buyerId: string, currentStatus: 'Approved' | 'Disabled') => {
    const newStatus = currentStatus === 'Approved' ? 'Disabled' : 'Approved';
    setAllBuyers(prev => prev.map(b => b.id === buyerId ? { ...b, status: newStatus } : b));
  };

  const buyers = allBuyers.filter(b => b.status === 'Approved');
  const pendingBuyers = allBuyers.filter(b => b.status === 'Pending');
  const disabledBuyers = allBuyers.filter(b => b.status === 'Disabled');

  return (
    <BuyerContext.Provider value={{ buyers, pendingBuyers, disabledBuyers, addPendingBuyer, approveBuyer, toggleBuyerStatus }}>
      {children}
    </BuyerContext.Provider>
  );
}

export function useBuyerContext() {
  const context = useContext(BuyerContext);
  if (context === undefined) {
    throw new Error("useBuyerContext must be used within a BuyerProvider");
  }
  return context;
}
