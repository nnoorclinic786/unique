
"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import type { Order } from "@/lib/types";
import { orders as initialOrders } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface OrderContextType {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addOrder: (order: Order) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const { toast } = useToast();

  useEffect(() => {
    // This effect runs once on the client to safely initialize state from localStorage.
    try {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        // If orders exist in storage, use them.
        setOrders(JSON.parse(storedOrders));
      } else {
        // If no orders are in storage, initialize storage with the default data.
        localStorage.setItem('orders', JSON.stringify(initialOrders));
        setOrders(initialOrders);
      }
    } catch (error) {
      console.error("Failed to read or initialize orders from localStorage", error);
      // If there's an error (e.g., corrupted data), reset to default and clean up.
      setOrders(initialOrders);
      localStorage.setItem('orders', JSON.stringify(initialOrders));
    }
  }, []);

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
        toast({
          title: "Order Status Updated",
          description: `Order ${orderId} has been marked as ${status}.`,
        });
        return updatedOrders;
    });
  }, [toast]);
  
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
