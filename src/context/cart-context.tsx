
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

export function CartProvider({ children }: { children: ReactNode }) {
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
