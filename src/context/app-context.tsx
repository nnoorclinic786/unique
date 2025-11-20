

'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { collection, doc, addDoc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { Order, Buyer, Medicine, Address, AdminUser } from '@/lib/types';
import {
  medicines as initialMedicines
} from '@/lib/data';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';

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
  const firestore = useFirestore();
  const [settings, setSettings] = useState<Settings>({ upiId: '' });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  
  // === FIRESTORE DATA ===
  const ordersCollection = useMemoFirebase(() => collection(firestore, 'orders'), [firestore]);
  const { data: ordersData } = useCollection<Order>(ordersCollection);
  const orders = ordersData || [];
  
  const buyersCollection = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const { data: allBuyersData } = useCollection<Buyer>(buyersCollection);
  const allBuyers = allBuyersData || [];
  
  const buyerRequestsCollection = useMemoFirebase(() => collection(firestore, 'buyer_requests'), [firestore]);
  const { data: pendingBuyersData } = useCollection<Buyer>(buyerRequestsCollection);
  
  const medicinesCollection = useMemoFirebase(() => collection(firestore, 'drugs'), [firestore]);
  const { data: medicinesData } = useCollection<Medicine>(medicinesCollection);
  const medicines = medicinesData || initialMedicines; // Fallback to initial data if needed

  const adminsCollection = useMemoFirebase(() => collection(firestore, 'admins'), [firestore]);
  const { data: adminsData } = useCollection<AdminUser>(adminsCollection);
  

  // Load non-Firestore state from localStorage on initial client render
  useEffect(() => {
    setSettings(getInitialState('appSettings', { upiId: '' }));
    setCartItems(getInitialState('cartItems', []));
    setHydrated(true);
  }, []);
  
  useEffect(() => {
    if(adminsData) {
      setAdmins(adminsData);
    }
  }, [adminsData]);


  // Persist non-Firestore state to localStorage whenever it changes
  useEffect(() => {
    if (hydrated) localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems, hydrated]);
  
  useEffect(() => {
    if (hydrated && admins.length) localStorage.setItem('admins', JSON.stringify(admins));
  }, [admins, hydrated]);


  // === ORDERS LOGIC ===
  const addOrder = useCallback(async (order: Omit<Order, 'id'>) => {
    const ordersCol = collection(firestore, 'orders');
    await addDoc(ordersCol, { ...order, createdAt: serverTimestamp() });
  }, [firestore]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    const orderDoc = doc(firestore, 'orders', orderId);
    await setDoc(orderDoc, { status }, { merge: true });
  }, [firestore]);

  // === BUYERS LOGIC ===
  const addPendingBuyer = useCallback(async (buyer: Buyer) => {
     const buyerRequestsCol = collection(firestore, 'buyer_requests');
     await addDoc(buyerRequestsCol, { ...buyer, createdAt: serverTimestamp() });
  }, [firestore]);

  const approveBuyer = useCallback(async (requestId: string) => {
    const requestDocRef = doc(firestore, 'buyer_requests', requestId);
    const buyerData = pendingBuyersData?.find(b => b.id === requestId);
    
    if (buyerData) {
        const userDocRef = doc(firestore, 'users', buyerData.id);
        await setDoc(userDocRef, { ...buyerData, status: 'Approved' });
        await deleteDoc(requestDocRef);
    }
  }, [firestore, pendingBuyersData]);

  const toggleBuyerStatus = useCallback(async (buyerId: string, currentStatus: 'Approved' | 'Disabled') => {
    const newStatus = currentStatus === 'Approved' ? 'Disabled' : 'Approved';
    const buyerDoc = doc(firestore, 'users', buyerId);
    await setDoc(buyerDoc, { status: newStatus }, { merge: true });
  }, [firestore]);
  
  const updateBuyerDetails = useCallback(async (buyerId: string, details: Partial<Pick<Buyer, 'name' | 'businessName'| 'personName' | 'email' | 'mobileNumber1' | 'gstNumber' | 'permanentAddress'>>) => {
    const buyerDoc = doc(firestore, 'users', buyerId);
    const payload = { ...details };
    if (details.businessName) {
        payload.name = details.businessName;
    }
    await setDoc(buyerDoc, payload, { merge: true });
  }, [firestore]);


  const addBuyerAddress = useCallback(async (buyerId: string, address: Omit<Address, 'id'>) => {
    const buyer = allBuyers.find(b => b.id === buyerId);
    if(buyer) {
        const newAddress = { ...address, id: `addr-${Date.now()}` };
        const updatedAddresses = [...(buyer.addresses || []), newAddress];
        const buyerDoc = doc(firestore, 'users', buyerId);
        await setDoc(buyerDoc, { addresses: updatedAddresses }, { merge: true });
    }
  }, [firestore, allBuyers]);

  const updateBuyerAddress = useCallback(async (buyerId: string, updatedAddress: Address) => {
    const buyer = allBuyers.find(b => b.id === buyerId);
    if(buyer) {
        const updatedAddresses = buyer.addresses?.map(addr => 
          addr.id === updatedAddress.id ? updatedAddress : addr
        ) || [];
        const buyerDoc = doc(firestore, 'users', buyerId);
        await setDoc(buyerDoc, { addresses: updatedAddresses }, { merge: true });
    }
  }, [firestore, allBuyers]);

  const deleteBuyerAddress = useCallback(async (buyerId: string, addressId: string) => {
    const buyer = allBuyers.find(b => b.id === buyerId);
    if(buyer) {
        const updatedAddresses = buyer.addresses?.filter(addr => addr.id !== addressId);
        const newDefault = buyer.defaultAddressId === addressId ? updatedAddresses?.[0]?.id : buyer.defaultAddressId;
        const buyerDoc = doc(firestore, 'users', buyerId);
        await setDoc(buyerDoc, { addresses: updatedAddresses, defaultAddressId: newDefault }, { merge: true });
    }
  }, [firestore, allBuyers]);

  const setBuyerDefaultAddress = useCallback(async (buyerId: string, addressId: string) => {
    const buyerDoc = doc(firestore, 'users', buyerId);
    await setDoc(buyerDoc, { defaultAddressId: addressId }, { merge: true });
  }, [firestore]);

  const approvedBuyers = allBuyers.filter((b) => b.status === 'Approved');
  const pendingBuyers = pendingBuyersData || [];
  const disabledBuyers = allBuyers.filter((b) => b.status === 'Disabled');

  // === MEDICINES LOGIC ===
  const addMedicine = useCallback(async (medicine: Omit<Medicine, 'id'>) => {
    const medicinesCol = collection(firestore, 'drugs');
    await addDoc(medicinesCol, { ...medicine, createdAt: serverTimestamp() });
  }, [firestore]);

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
    
    const adminDoc = doc(firestore, 'admins', adminData.email);
    setDoc(adminDoc, newAdmin, { merge: true });

    return { success: true };
  }, [admins, firestore]);

  const updateAdminPermissions = useCallback(async (email: string, permissions: string[]) => {
    const admin = admins.find(a => a.email === email);
    if (admin && admin.role !== 'Super Admin') {
        const adminDoc = doc(firestore, 'admins', email);
        await setDoc(adminDoc, { permissions }, { merge: true });
        return { success: true, message: `Permissions for ${email} updated.` };
    }
    return { success: false, message: 'Admin not found or is a Super Admin.' };
  }, [admins, firestore]);

  const approveAdmin = useCallback(async (email: string) => {
    const admin = admins.find(a => a.email === email);
    if (admin && admin.status === 'Pending') {
        const adminDoc = doc(firestore, 'admins', email);
        await setDoc(adminDoc, { status: 'Approved', permissions: ['dashboard'] }, { merge: true });
        return { success: true, message: `${admin.name} has been approved.` };
    }
    return { success: false, error: 'User not found or not pending.' };
  }, [admins, firestore]);

  const toggleAdminStatus = useCallback(async (email: string, currentStatus: 'Approved' | 'Disabled') => {
      const admin = admins.find(a => a.email === email);
      if (admin && admin.role !== 'Super Admin') {
          const newStatus = currentStatus === 'Approved' ? 'Disabled' : 'Approved';
          const adminDoc = doc(firestore, 'admins', email);
          await setDoc(adminDoc, { status: newStatus }, { merge: true });
          return { success: true, message: `${admin.name}'s account has been ${newStatus.toLowerCase()}.` };
      }
      return { success: false, error: 'User not found or is a Super Admin.' };
  }, [admins, firestore]);

  const updateAdminDetails = useCallback((currentEmail: string, details: Partial<AdminUser> & { currentPassword?: string, newPassword?: string }) => {
    const adminToUpdate = admins.find(a => a.email === currentEmail);
    if(!adminToUpdate) return { success: false, error: "Admin not found." };
    
    const updates: Partial<AdminUser> = {};

    if (details.newPassword) {
        if (!details.currentPassword || details.currentPassword !== adminToUpdate.password) {
          return { success: false, error: "Incorrect current password." };
        }
        updates.password = details.newPassword;
    }

    updates.name = details.name || adminToUpdate.name;
    
    if (adminToUpdate.role !== 'Super Admin' && details.email && details.email !== currentEmail) {
        const emailExists = admins.some(a => a.email === details.email);
        if(emailExists) {
            return { success: false, error: "Another user with this email already exists." };
        }
        updates.email = details.email;
        // Note: Changing email in Firestore might require re-authentication or more complex logic if email is used as document ID.
        // For simplicity, we assume email can be updated here. A real app might handle this differently.
    }
    
    const adminDoc = doc(firestore, 'admins', currentEmail);
    setDoc(adminDoc, updates, { merge: true });
    
    return { success: true };
  }, [admins, firestore]);


  // === VALUE FOR PROVIDER ===
  const value: AppContextType = {
    orders,
    addOrder: (order) => addOrder(order as Omit<Order, 'id'>),
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
    addMedicine: (medicine) => addMedicine(medicine as Omit<Medicine, 'id'>),
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
