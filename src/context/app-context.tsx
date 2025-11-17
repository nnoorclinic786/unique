

'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import type { Order, Buyer, Medicine, Address } from '@/lib/types';
import {
  orders as initialOrders,
  buyers as initialBuyers,
  medicines as initialMedicines,
} from '@/lib/data';

// == TYPES ==
interface Settings {
  upiId: string;
}

interface CartItem extends Medicine {
  quantity: number;
}

interface AppContextType {
  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addOrder: (order: Order) => void;

  // Buyers
  buyers: Buyer[];
  pendingBuyers: Buyer[];
  disabledBuyers: Buyer[];
  addPendingBuyer: (buyer: Buyer) => void;
  approveBuyer: (buyerId: string) => void;
  toggleBuyerStatus: (buyerId: string, status: 'Approved' | 'Disabled') => void;
  updateBuyerDetails: (buyerId: string, details: Partial<Pick<Buyer, 'name' | 'personName' | 'email' | 'mobileNumber1' | 'gstNumber' | 'permanentAddress'>>) => void;
  
  // Buyer Addresses
  addBuyerAddress: (buyerId: string, address: Omit<Address, 'id'>) => void;
  updateBuyerAddress: (buyerId: string, address: Address) => void;
  deleteBuyerAddress: (buyerId: string, addressId: string) => void;
  setBuyerDefaultAddress: (buyerId: string, addressId: string) => void;

  // Medicines
  medicines: Medicine[];
  addMedicine: (medicine: Medicine) => void;

  // Settings
  settings: Settings;
  setSettings: (settings: Settings) => void;

  // Cart
  cartItems: CartItem[];
  addToCart: (item: Medicine) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  cartCount: number;
  clearCart: () => void;
}

// == CONTEXT CREATION ==
const AppContext = createContext<AppContextType | undefined>(undefined);

// == LAZY INITIALIZER FUNCTION ==
function getInitialState<T>(key: string, initialData: T): T {
  if (typeof window === 'undefined') {
    return initialData;
  }
  try {
    const item = window.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    } else {
      // If no item, set it in localStorage and return initial data
      window.localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
    return initialData;
  }
}

// == PROVIDER COMPONENT ==
export function AppProvider({ children }: { children: ReactNode }) {
  // === STATE MANAGEMENT ===
  const [orders, setOrders] = useState<Order[]>(() => getInitialState('orders', initialOrders));
  const [buyers, setBuyers] = useState<Buyer[]>(() => getInitialState('buyers', initialBuyers));
  const [medicines, setMedicines] = useState<Medicine[]>(() => getInitialState('medicines', initialMedicines));
  const [settings, setSettings] = useState<Settings>(() => getInitialState('appSettings', { upiId: '' }));
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getInitialState('cartItems', []));
  
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('buyers', JSON.stringify(buyers));
  }, [buyers]);
  
  useEffect(() => {
    localStorage.setItem('medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);


  // === ORDERS LOGIC ===
  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  }, []);

  // === BUYERS LOGIC ===
  const addPendingBuyer = useCallback((buyer: Buyer) => {
    setBuyers((prev) => [...prev, buyer]);
  }, []);

  const approveBuyer = useCallback((buyerId: string) => {
    setBuyers((prev) =>
      prev.map((b) => (b.id === buyerId ? { ...b, status: 'Approved' } : b))
    );
  }, []);

  const toggleBuyerStatus = useCallback((buyerId: string, currentStatus: 'Approved' | 'Disabled') => {
    const newStatus = currentStatus === 'Approved' ? 'Disabled' : 'Approved';
    setBuyers((prev) =>
      prev.map((b) => (b.id === buyerId ? { ...b, status: newStatus } : b))
    );
  }, []);
  
  const updateBuyerDetails = useCallback((buyerId: string, details: Partial<Pick<Buyer, 'name' | 'personName' | 'email' | 'mobileNumber1' | 'gstNumber' | 'permanentAddress'>>) => {
    setBuyers(prev => prev.map(buyer => {
        if (buyer.id === buyerId) {
            return { ...buyer, ...details };
        }
        return buyer;
    }));
  }, []);


  const addBuyerAddress = useCallback((buyerId: string, address: Omit<Address, 'id'>) => {
    setBuyers(prev => prev.map(buyer => {
      if (buyer.id === buyerId) {
        const newAddress = { ...address, id: `addr-${Date.now()}` };
        const updatedAddresses = [...(buyer.addresses || []), newAddress];
        return { ...buyer, addresses: updatedAddresses };
      }
      return buyer;
    }));
  }, []);

  const updateBuyerAddress = useCallback((buyerId: string, updatedAddress: Address) => {
    setBuyers(prev => prev.map(buyer => {
      if (buyer.id === buyerId) {
        const updatedAddresses = buyer.addresses?.map(addr => 
          addr.id === updatedAddress.id ? updatedAddress : addr
        ) || [];
        return { ...buyer, addresses: updatedAddresses };
      }
      return buyer;
    }));
  }, []);

  const deleteBuyerAddress = useCallback((buyerId: string, addressId: string) => {
    setBuyers(prev => prev.map(buyer => {
      if (buyer.id === buyerId) {
        const updatedAddresses = buyer.addresses?.filter(addr => addr.id !== addressId);
        // If the deleted address was the default, set a new default
        const newDefault = buyer.defaultAddressId === addressId ? updatedAddresses?.[0]?.id : buyer.defaultAddressId;
        return { ...buyer, addresses: updatedAddresses, defaultAddressId: newDefault };
      }
      return buyer;
    }));
  }, []);

  const setBuyerDefaultAddress = useCallback((buyerId: string, addressId: string) => {
    setBuyers(prev => prev.map(buyer => 
      buyer.id === buyerId ? { ...buyer, defaultAddressId: addressId } : buyer
    ));
  }, []);

  const approvedBuyers = buyers.filter((b) => b.status === 'Approved');
  const pendingBuyers = buyers.filter((b) => b.status === 'Pending');
  const disabledBuyers = buyers.filter((b) => b.status === 'Disabled');

  // === MEDICINES LOGIC ===
  const addMedicine = useCallback((medicine: Medicine) => {
    setMedicines((prev) => [...prev, medicine]);
  }, []);

  // === CART LOGIC ===
  const addToCart = useCallback((item: Medicine) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    }
  }, [removeFromCart]);
  
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // === VALUE FOR PROVIDER ===
  const value: AppContextType = {
    orders,
    addOrder,
    updateOrderStatus,
    buyers: approvedBuyers,
    pendingBuyers,
    disabledBuyers,
    addPendingBuyer,
    approveBuyer,
    toggleBuyerStatus,
    updateBuyerDetails,
    addBuyerAddress,
    updateBuyerAddress,
    deleteBuyerAddress,
    setBuyerDefaultAddress,
    medicines,
    addMedicine,
    settings,
    setSettings,
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartCount,
    clearCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// == CUSTOM HOOK ==
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
