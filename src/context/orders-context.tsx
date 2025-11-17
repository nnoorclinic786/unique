
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
    try {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        // If no orders in storage, initialize with default data
        localStorage.setItem('orders', JSON.stringify(initialOrders));
      }
    } catch (error) {
      console.error("Failed to parse orders from localStorage", error);
      setOrders(initialOrders); // Fallback to initial data
      localStorage.removeItem('orders');
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
