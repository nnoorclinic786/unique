
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
      }
    } catch (error) {
      console.error("Failed to parse orders from localStorage", error);
      setOrders(initialOrders); // Fallback to initial data
      localStorage.removeItem('orders');
    }
  }, []);

  const updateOrdersStateAndStorage = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('orders', JSON.stringify(newOrders));
  };


  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    updateOrdersStateAndStorage(updatedOrders);
    toast({
      title: "Order Status Updated",
      description: `Order ${orderId} has been marked as ${status}.`,
    });
  }, [orders, toast]);
  
  const addOrder = useCallback((order: Order) => {
    const updatedOrders = [order, ...orders];
    updateOrdersStateAndStorage(updatedOrders);
     toast({
      title: "Order Placed!",
      description: `Your order ${order.id} has been successfully placed.`,
    });
  }, [orders, toast]);

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
