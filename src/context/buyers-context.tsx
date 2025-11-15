
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Buyer } from "@/lib/types";
import { buyers as initialBuyers } from "@/lib/data";

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
  const [buyers, setBuyers] = useState<Buyer[]>(initialBuyers.filter(b => b.status === 'Approved'));
  const [pendingBuyers, setPendingBuyers] = useState<Buyer[]>(initialBuyers.filter(b => b.status === 'Pending'));
  const [disabledBuyers, setDisabledBuyers] = useState<Buyer[]>(initialBuyers.filter(b => b.status === 'Disabled'));


  const addPendingBuyer = (buyer: Buyer) => {
    setPendingBuyers((prev) => [...prev, buyer]);
  };
  
  const approveBuyer = (buyerId: string) => {
    const buyerToApprove = pendingBuyers.find(b => b.id === buyerId);
    if (buyerToApprove) {
        setPendingBuyers(prev => prev.filter(b => b.id !== buyerId));
        setBuyers(prev => [...prev, { ...buyerToApprove, status: 'Approved' }]);
    }
  };

  const toggleBuyerStatus = (buyerId: string, currentStatus: 'Approved' | 'Disabled') => {
    if (currentStatus === 'Approved') {
      const buyerToDisable = buyers.find(b => b.id === buyerId);
      if (buyerToDisable) {
        setBuyers(prev => prev.filter(b => b.id !== buyerId));
        setDisabledBuyers(prev => [...prev, { ...buyerToDisable, status: 'Disabled' }]);
      }
    } else { // currentStatus is 'Disabled'
      const buyerToEnable = disabledBuyers.find(b => b.id === buyerId);
      if (buyerToEnable) {
        setDisabledBuyers(prev => prev.filter(b => b.id !== buyerId));
        setBuyers(prev => [...prev, { ...buyerToEnable, status: 'Approved' }]);
      }
    }
  };

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
