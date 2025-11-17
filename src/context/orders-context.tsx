
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
    // This effect runs once on the client to initialize state from localStorage
    try {
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        } else {
            // If no orders in storage, seed it with the initial data
            localStorage.setItem('orders', JSON.stringify(initialOrders));
            setOrders(initialOrders);
        }
    } catch (error) {
        console.error("Failed to process orders from localStorage", error);
        // Fallback to initial data if storage is corrupt
        setOrders(initialOrders);
    }
  }, []);

  useEffect(() => {
    // This effect persists any change in the orders state back to localStorage, but only after initial load.
    if (orders.length > 0) {
        try {
            localStorage.setItem('orders', JSON.stringify(orders));
        } catch (error) {
            console.error("Failed to save orders to localStorage", error);
        }
    } else if (orders.length === 0 && typeof window !== 'undefined' && localStorage.getItem('orders')) {
      // Handle case where all orders are cleared
      localStorage.setItem('orders', '[]');
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
