
"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import type { Order } from "@/lib/types";
import { orders as initialOrders } from "@/lib/data";

interface OrderContextType {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addOrder: (order: Order) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // This effect runs once on the client to safely initialize state from localStorage.
    // It prevents re-injecting initialOrders on subsequent renders or page navigations.
    try {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        // Only set initial orders if localStorage is empty
        localStorage.setItem('orders', JSON.stringify(initialOrders));
        setOrders(initialOrders);
      }
    } catch (error) {
      console.error("Failed to read or initialize orders from localStorage", error);
      // Fallback to initial orders and reset storage in case of corruption
      localStorage.setItem('orders', JSON.stringify(initialOrders));
      setOrders(initialOrders);
    }
  }, []); // The empty dependency array ensures this runs only once on mount.

  const updateOrdersStateAndStorage = (newOrders: Order[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem('orders', JSON.stringify(newOrders));
    } catch (error) {
        console.error("Failed to save orders to localStorage", error);
    }
  };


  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        );
        updateOrdersStateAndStorage(updatedOrders);
        return updatedOrders;
    });
  }, []);
  
  const addOrder = useCallback((order: Order) => {
    setOrders(prevOrders => {
        const updatedOrders = [order, ...prevOrders];
        updateOrdersStateAndStorage(updatedOrders);
        return updatedOrders;
    });
  }, []);

  return (
    <OrderContext.Provider value={{ orders, updateOrderStatus, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
}
