

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

// == INITIAL STATE FUNCTION ==
function getInitialState<T>(key: string, initialData: T[]): T[] {
  if (typeof window === 'undefined') {
    return initialData;
  }
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    } else {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
  } catch (error) {
    console.error(`Failed to process ${key} from localStorage`, error);
    return initialData;
  }
}

// == PROVIDER COMPONENT ==
export function AppProvider({ children }: { children: ReactNode }) {
  // === STATE MANAGEMENT ===
  const [orders, setOrders] = useState<Order[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [settings, setSettings] = useState<Settings>({ upiId: '' });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs once on the client to initialize all states from localStorage
    setOrders(getInitialState('orders', initialOrders));
    setBuyers(getInitialState('buyers', initialBuyers));
    setMedicines(getInitialState('medicines', initialMedicines));
    setCartItems(getInitialState('cartItems', []));
    
    try {
        const storedSettings = localStorage.getItem('appSettings');
        if (storedSettings) {
            const parsed = JSON.parse(storedSettings);
            if (parsed) setSettings(parsed);
        }
    } catch(e) { console.error(e); }

    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders, isClient]);

  useEffect(() => {
    if (isClient) localStorage.setItem('buyers', JSON.stringify(buyers));
  }, [buyers, isClient]);
  
  useEffect(() => {
    if (isClient) localStorage.setItem('medicines', JSON.stringify(medicines));
  }, [medicines, isClient]);

  useEffect(() => {
    if (isClient) localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings, isClient]);

  useEffect(() => {
    if (isClient) localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems, isClient]);


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
    const newBuyerWithAddress = {
      ...buyer,
      addresses: [{ id: `addr-${Date.now()}`, name: 'Primary', fullAddress: buyer.address || '' }],
      defaultAddressId: `addr-${Date.now()}`
    }
    delete newBuyerWithAddress.address; // remove old address field
    setBuyers((prev) => [...prev, newBuyerWithAddress]);
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
