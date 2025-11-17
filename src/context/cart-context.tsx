
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { Medicine } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface CartItem extends Medicine {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Medicine) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  cartCount: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // On initial load, try to get cart items from localStorage
    try {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            setCartItems(parsedCart);
        }
    } catch (error) {
        console.error("Failed to parse cart items from localStorage", error);
        localStorage.removeItem('cartItems');
    }
  }, []);

  useEffect(() => {
    // Update cart count whenever cartItems change
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
    // Persist cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);


  const addToCart = (item: Medicine) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        // If item doesn't exist, add it with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    toast({
        title: "Added to Cart",
        description: `${item.name} has been added to your cart.`,
    })
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
     toast({
        title: "Item Removed",
        description: `The item has been removed from your cart.`,
    })
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
        removeFromCart(itemId);
    } else {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
            )
        );
    }
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
