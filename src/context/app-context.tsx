
'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import type { Order, Buyer, Medicine, Address, AdminUser } from '@/lib/types';
import {
  orders as initialOrders,
  buyers as initialBuyers,
  medicines as initialMedicines,
  admins as initialAdmins,
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
  updateBuyerDetails: (buyerId: string, details: Partial<Pick<Buyer, 'name' | 'businessName' | 'personName' | 'email' | 'mobileNumber1' | 'gstNumber' | 'permanentAddress'>>) => void;
  
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

  // Admins
  admins: AdminUser[];
  getAdmins: () => AdminUser[];
  addPendingAdmin: (admin: Omit<AdminUser, 'role' | 'permissions' | 'status'>) => { success: boolean, error?: string };
  updateAdminPermissions: (email: string, permissions: string[]) => Promise<{ success: boolean; message: string; }>;
  approveAdmin: (email: string) => Promise<{ success: boolean; message: string; error?: undefined; } | { success: boolean; error: string; message?: undefined; }>;
  toggleAdminStatus: (email: string, currentStatus: 'Approved' | 'Disabled') => Promise<{ success: boolean; message: string; error?: undefined; } | { success: boolean; error: string; message?: undefined; }>;
  updateAdminDetails: (email: string, details: Partial<AdminUser>) => { success: boolean, error?: string };
}

// == CONTEXT CREATION ==
const AppContext = createContext<AppContextType | undefined>(undefined);

// == HELPER FUNCTION FOR LOCALSTORAGE ==
function getInitialState<T>(key: string, initialData: T): T {
  if (typeof window !== 'undefined') {
    const item = window.localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item);
      } catch (error) {
        console.error(`Error parsing JSON from localStorage for key "${key}":`, error);
        return initialData;
      }
    }
  }
  return initialData;
}


// == PROVIDER COMPONENT ==
export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  // === STATE MANAGEMENT ===
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [allBuyers, setAllBuyers] = useState<Buyer[]>(initialBuyers);
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [settings, setSettings] = useState<Settings>({ upiId: '' });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  
  // Load state from localStorage on initial client render
  useEffect(() => {
    setOrders(getInitialState('orders', initialOrders));
    setAllBuyers(getInitialState('buyers', initialBuyers));
    setMedicines(getInitialState('medicines', initialMedicines));
    setSettings(getInitialState('appSettings', { upiId: '' }));
    setCartItems(getInitialState('cartItems', []));
    setAdmins(getInitialState('admins', initialAdmins));
    setHydrated(true);
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (hydrated) localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders, hydrated]);

  useEffect(() => {
     if (hydrated) localStorage.setItem('buyers', JSON.stringify(allBuyers));
  }, [allBuyers, hydrated]);
  
  useEffect(() => {
    if (hydrated) localStorage.setItem('medicines', JSON.stringify(medicines));
  }, [medicines, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('admins', JSON.stringify(admins));
  }, [admins, hydrated]);


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
    setAllBuyers((prev) => [...prev, buyer]);
  }, []);

  const approveBuyer = useCallback((buyerId: string) => {
    setAllBuyers((prev) =>
      prev.map((b) => (b.id === buyerId ? { ...b, status: 'Approved' } : b))
    );
  }, []);

  const toggleBuyerStatus = useCallback((buyerId: string, currentStatus: 'Approved' | 'Disabled') => {
    const newStatus = currentStatus === 'Approved' ? 'Disabled' : 'Approved';
    setAllBuyers((prev) =>
      prev.map((b) => (b.id === buyerId ? { ...b, status: newStatus } : b))
    );
  }, []);
  
  const updateBuyerDetails = useCallback((buyerId: string, details: Partial<Pick<Buyer, 'name' | 'businessName'| 'personName' | 'email' | 'mobileNumber1' | 'gstNumber' | 'permanentAddress'>>) => {
    setAllBuyers(prev => prev.map(buyer => {
        if (buyer.id === buyerId) {
            const newDetails = { ...buyer, ...details };
            if (details.businessName) {
                newDetails.name = details.businessName;
            }
            return newDetails;
        }
        return buyer;
    }));
  }, []);


  const addBuyerAddress = useCallback((buyerId: string, address: Omit<Address, 'id'>) => {
    setAllBuyers(prev => prev.map(buyer => {
      if (buyer.id === buyerId) {
        const newAddress = { ...address, id: `addr-${Date.now()}` };
        const updatedAddresses = [...(buyer.addresses || []), newAddress];
        return { ...buyer, addresses: updatedAddresses };
      }
      return buyer;
    }));
  }, []);

  const updateBuyerAddress = useCallback((buyerId: string, updatedAddress: Address) => {
    setAllBuyers(prev => prev.map(buyer => {
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
    setAllBuyers(prev => prev.map(buyer => {
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
    setAllBuyers(prev => prev.map(buyer => 
      buyer.id === buyerId ? { ...buyer, defaultAddressId: addressId } : buyer
    ));
  }, []);

  const approvedBuyers = allBuyers.filter((b) => b.status === 'Approved');
  const pendingBuyers = allBuyers.filter((b) => b.status === 'Pending');
  const disabledBuyers = allBuyers.filter((b) => b.status === 'Disabled');

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
  
  // === ADMINS LOGIC ===
  const getAdmins = useCallback(() => {
      return admins;
  }, [admins]);

  const addPendingAdmin = useCallback((adminData: Omit<AdminUser, 'role' | 'permissions' | 'status'>) => {
    const existingUser = admins.find(u => u.email === adminData.email);
    if (existingUser) {
        return { success: false, error: "An admin with this email already exists." };
    }

    const newAdmin: AdminUser = {
        ...adminData,
        role: "Admin",
        permissions: [],
        status: 'Pending' as const,
    };
    setAdmins(prev => [...prev, newAdmin]);
    return { success: true };
  }, [admins]);

  const updateAdminPermissions = useCallback(async (email: string, permissions: string[]) => {
    setAdmins(prev => prev.map(admin => {
        if (admin.email === email && admin.role !== 'Super Admin') {
            return { ...admin, permissions };
        }
        return admin;
    }));
    return { success: true, message: `Permissions for ${email} updated.` };
  }, []);

  const approveAdmin = useCallback(async (email: string) => {
    let success = false;
    let userName = '';
    setAdmins(prev => prev.map(admin => {
        if (admin.email === email && admin.status === 'Pending') {
            success = true;
            userName = admin.name;
            return { ...admin, status: 'Approved' as const, permissions: ['dashboard'] };
        }
        return admin;
    }));
    if (success) {
      return { success: true, message: `${userName} has been approved.` };
    }
    return { success: false, error: 'User not found or not pending.' };
  }, []);

  const toggleAdminStatus = useCallback(async (email: string, currentStatus: 'Approved' | 'Disabled') => {
      let userToggled = false;
      let newStatus: 'Approved' | 'Disabled' = 'Approved';
      let userName = '';
      
      setAdmins(prev => prev.map(admin => {
          if (admin.email === email && admin.role !== 'Super Admin') {
              userToggled = true;
              userName = admin.name;
              newStatus = currentStatus === 'Approved' ? 'Disabled' : 'Approved';
              return { ...admin, status: newStatus };
          }
          return admin;
      }));

      if (userToggled) {
          return { success: true, message: `${userName}'s account has been ${newStatus.toLowerCase()}.` };
      }
      return { success: false, error: 'User not found or is a Super Admin.' };
  }, []);

  const updateAdminDetails = useCallback((currentEmail: string, details: Partial<AdminUser> & { currentPassword?: string, newPassword?: string }) => {
    let success = false;
    let error: string | undefined = "Admin not found.";

    setAdmins(prevAdmins => {
      const newAdmins = [...prevAdmins];
      const adminIndex = newAdmins.findIndex(a => a.email === currentEmail);

      if (adminIndex === -1) {
        return prevAdmins;
      }
      
      const adminToUpdate = { ...newAdmins[adminIndex] };

      // Password validation
      if (details.newPassword) {
        if (!details.currentPassword || details.currentPassword !== adminToUpdate.password) {
          error = "Incorrect current password.";
          return prevAdmins;
        }
        adminToUpdate.password = details.newPassword;
      }

      // Update other details
      adminToUpdate.name = details.name || adminToUpdate.name;
      
      // Prevent Super Admin email change
      if (adminToUpdate.role !== 'Super Admin' && details.email && details.email !== currentEmail) {
          const emailExists = newAdmins.some(a => a.email === details.email);
          if(emailExists) {
              error = "Another user with this email already exists.";
              return prevAdmins;
          }
          adminToUpdate.email = details.email;
      }
      
      newAdmins[adminIndex] = adminToUpdate;
      success = true;
      error = undefined;
      return newAdmins;
    });

    return { success, error };
  }, []);


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
    admins,
    getAdmins,
    addPendingAdmin,
    updateAdminPermissions,
    approveAdmin,
    toggleAdminStatus,
    updateAdminDetails,
  };

  if (!hydrated) {
    // Render nothing or a loading spinner on the server or before hydration
    return null;
  }

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
