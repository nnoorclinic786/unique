
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type { Order } from "@/lib/types";
import { orders as initialOrders } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface OrderContextType {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const { toast } = useToast();

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    toast({
      title: "Order Status Updated",
      description: `Order ${orderId} has been marked as ${status}.`,
    });
  }, [toast]);

  return (
    <OrderContext.Provider value={{ orders, updateOrderStatus }}>
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
