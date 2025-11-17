
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

const getInitialOrders = (): Order[] => {
    if (typeof window === 'undefined') {
        return [];
    }
    try {
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            return JSON.parse(storedOrders);
        } else {
            localStorage.setItem('orders', JSON.stringify(initialOrders));
            return initialOrders;
        }
    } catch (error) {
        console.error("Failed to read orders from localStorage", error);
        // In case of error, fall back to initial data and reset storage
        localStorage.setItem('orders', JSON.stringify(initialOrders));
        return initialOrders;
    }
};


export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(getInitialOrders);

  useEffect(() => {
    // This effect ensures that any updates to the orders state are persisted to localStorage.
    try {
      localStorage.setItem('orders', JSON.stringify(orders));
    } catch (error) {
        console.error("Failed to save orders to localStorage", error);
    }
  }, [orders]);


  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prevOrders => 
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
    );
  }, []);
  
  const addOrder = useCallback((order: Order) => {
    setOrders(prevOrders => 
        [order, ...prevOrders]
    );
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
