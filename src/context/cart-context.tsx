
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { Medicine } from "@/lib/types";

interface CartItem extends Medicine {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Medicine) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  decrementQuantity: (itemId: string) => void;
  cartCount: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getInitialCart = (): CartItem[] => {
    if (typeof window === 'undefined') {
        return [];
    }
    try {
        const storedCart = localStorage.getItem('cartItems');
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error("Failed to parse cart items from localStorage", error);
        return [];
    }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Update cart count and persist to localStorage whenever cartItems change
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
    try {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
        console.error("Failed to save cart to localStorage", error);
    }
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
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
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
  
  const decrementQuantity = (itemId: string) => {
    setCartItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === itemId);
        if (existingItem && existingItem.quantity > 1) {
            return prevItems.map((i) =>
                i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
            );
        } else {
            return prevItems.filter((i) => i.id !== itemId);
        }
    });
  }
  
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, decrementQuantity, cartCount, clearCart }}>
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
