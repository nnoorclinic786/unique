
'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { collection, doc, addDoc, deleteDoc, setDoc, serverTimestamp, increment, getDoc, updateDoc } from "firebase/firestore";
import type { Order, Buyer, Medicine, Address, AdminUser } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import Cookies from 'js-cookie';

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
  addOrder: (order: Omit<Order, 'id' | 'date' | 'itemCount'>) => void;

  // Buyers
  buyers: Buyer[];
  pendingBuyers: Buyer[];
  disabledBuyers: Buyer[];
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
  addMedicine: (medicine: Omit<Medicine, 'id'>) => Promise<any>;
  updateMedicine: (medicine: Medicine) => void;
  deleteMedicine: (medicineId: string) => void;

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
  addPendingAdmin: (admin: Omit<AdminUser, 'role' | 'permissions' | 'status'|'id'>) => Promise<{ success: boolean; error?: string; }>;
  updateAdminPermissions: (email: string, permissions: string[]) => Promise<{ success: boolean; message: string; }>;
  approveAdmin: (email: string) => Promise<{ success: boolean; message: string; error?: undefined; } | { success: boolean; error: string; message?: undefined; }>;
  toggleAdminStatus: (email: string, currentStatus: 'Approved' | 'Disabled') => Promise<{ success: boolean; message: string; error?: undefined; } | { success: boolean; error: string; message?: undefined; }>;
  updateAdminDetails: (email: string, details: Partial<AdminUser>) => Promise<{ success: boolean, error?: string }>;
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
  const { user } = useUser();
  const [settings, setSettings] = useState<Settings>({ upiId: '' });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  useEffect(() => {
    const adminCookie = Cookies.get('admin_session');
    if (adminCookie) {
      try {
        const session = JSON.parse(adminCookie);
        if (session.isLoggedIn) {
          setIsAdminLoggedIn(true);
        }
      } catch(e) {
        setIsAdminLoggedIn(false);
      }
    } else {
        setIsAdminLoggedIn(false);
    }
  }, []);

  // === FIRESTORE DATA ===
  const ordersCollection = useMemoFirebase(() => (firestore && isAdminLoggedIn) ? collection(firestore, 'orders') : null, [firestore, isAdminLoggedIn]);
  const { data: ordersData } = useCollection<Order>(ordersCollection);
  
  const buyersCollection = useMemoFirebase(() => (firestore && isAdminLoggedIn) ? collection(firestore, 'users') : null, [firestore, isAdminLoggedIn]);
  const { data: allBuyersData } = useCollection<Buyer>(buyersCollection);
  
  const buyerRequestsCollection = useMemoFirebase(() => (firestore) ? collection(firestore, 'buyer_requests') : null, [firestore]);
  const { data: pendingBuyersData } = useCollection<Buyer>(buyerRequestsCollection);
  
  const medicinesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'drugs') : null, [firestore]);
  const { data: medicinesData } = useCollection<Medicine>(medicinesCollection);
  
  const adminsCollection = useMemoFirebase(() => (firestore && isAdminLoggedIn) ? collection(firestore, 'admins') : null, [firestore, isAdminLoggedIn]);
  const { data: adminsData } = useCollection<AdminUser>(adminsCollection);

  const initialAdmins: AdminUser[] = [
    {
      email: 'uniquemedicare786@gmail.com',
      name: 'Unique Medicare',
      role: 'Super Admin',
      permissions: ['dashboard', 'orders', 'drugs', 'buyers', 'manage_admins', 'settings'],
      status: 'Approved',
      password: 'uniquemedicare@123#',
    },
  ];
  
  const orders = ordersData || [];
  const allBuyers = allBuyersData || [];
  const pendingBuyers = pendingBuyersData || [];
  const medicines = medicinesData || [];
  const admins = adminsData || initialAdmins;
  

  // Load non-Firestore state from localStorage on initial client render
  useEffect(() => {
    setSettings(getInitialState('appSettings', { upiId: '' }));
    setCartItems(getInitialState('cartItems', []));
    setActiveOrderId(getInitialState('activeOrderId', null));
    setHydrated(true);
  }, []);


  // Persist non-Firestore state to localStorage whenever it changes
  useEffect(() => {
    if (hydrated) localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('activeOrderId', JSON.stringify(activeOrderId));
  }, [activeOrderId, hydrated]);
  

  const createOrUpdateOrder = useCallback(async (currentCartItems: CartItem[]) => {
    if (!firestore || !user || !currentCartItems.length) return;

    const buyer = allBuyers.find(b => b.id === user.uid);
    if (!buyer) return;

    const subtotal = currentCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal + (subtotal * 0.05); // Assuming 5% tax

    const orderData = {
      buyerId: user.uid,
      buyerName: buyer.name,
      items: currentCartItems.map(({id, name, quantity, price}) => ({id, name, quantity, price})),
      itemCount: currentCartItems.reduce((acc, item) => acc + item.quantity, 0),
      total: total,
      status: 'draft' as const,
      date: new Date().toISOString().split('T')[0],
      updatedAt: serverTimestamp(),
    };

    if (activeOrderId) {
      const orderRef = doc(firestore, 'orders', activeOrderId);
      await setDoc(orderRef, orderData, { merge: true });
    } else {
      const ordersCol = collection(firestore, 'orders');
      const newOrderRef = await addDoc(ordersCol, { ...orderData, createdAt: serverTimestamp() });
      setActiveOrderId(newOrderRef.id);
    }
  }, [firestore, user, allBuyers, activeOrderId]);

  // === ORDERS LOGIC ===
  const addOrder = useCallback(async (order: Omit<Order, 'id' | 'date' | 'itemCount'>) => {
     if (!firestore || !user || !activeOrderId) return;
    const orderRef = doc(firestore, 'orders', activeOrderId);
    await setDoc(orderRef, {
        status: 'Pending',
        date: new Date().toISOString().split('T')[0], // Finalize order date
    }, { merge: true });
    // Reset cart and active order ID after placing
    clearCart();
  }, [firestore, user, activeOrderId]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    if (!firestore) return;
    const orderDoc = doc(firestore, 'orders', orderId);
    await setDoc(orderDoc, { status }, { merge: true });
  }, [firestore]);

  // === BUYERS LOGIC ===
  const approveBuyer = useCallback(async (requestId: string) => {
    if (!firestore) return;
    const buyerData = pendingBuyers?.find(b => b.id === requestId);
    
    if (buyerData) {
        const userDocRef = doc(firestore, 'users', buyerData.id);
        await setDoc(userDocRef, { ...buyerData, status: 'Approved' });
        const requestDocRef = doc(firestore, 'buyer_requests', requestId);
        await deleteDoc(requestDocRef);
    }
  }, [firestore, pendingBuyers]);

  const toggleBuyerStatus = useCallback(async (buyerId: string, currentStatus: 'Approved' | 'Disabled') => {
    if (!firestore) return;
    const newStatus = currentStatus === 'Approved' ? 'Disabled' : 'Approved';
    const buyerDoc = doc(firestore, 'users', buyerId);
    await setDoc(buyerDoc, { status: newStatus }, { merge: true });
  }, [firestore]);
  
  const updateBuyerDetails = useCallback(async (buyerId: string, details: Partial<Pick<Buyer, 'name' | 'businessName'| 'personName' | 'email' | 'mobileNumber1' | 'gstNumber' | 'permanentAddress'>>) => {
    if (!firestore) return;
    const buyerDoc = doc(firestore, 'users', buyerId);
    const payload = { ...details };
    if (details.businessName) {
        payload.name = details.businessName;
    }
    await setDoc(buyerDoc, payload, { merge: true });
  }, [firestore]);


  const addBuyerAddress = useCallback(async (buyerId: string, address: Omit<Address, 'id'>) => {
    if (!firestore) return;
    const buyer = allBuyers.find(b => b.id === buyerId);
    if(buyer) {
        const newAddress = { ...address, id: `addr-${Date.now()}` };
        const updatedAddresses = [...(buyer.addresses || []), newAddress];
        const buyerDoc = doc(firestore, 'users', buyerId);
        await setDoc(buyerDoc, { addresses: updatedAddresses }, { merge: true });
    }
  }, [firestore, allBuyers]);

  const updateBuyerAddress = useCallback(async (buyerId: string, updatedAddress: Address) => {
    if (!firestore) return;
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
    if (!firestore) return;
    const buyer = allBuyers.find(b => b.id === buyerId);
    if(buyer) {
        const updatedAddresses = buyer.addresses?.filter(addr => addr.id !== addressId);
        const newDefault = buyer.defaultAddressId === addressId ? updatedAddresses?.[0]?.id : buyer.defaultAddressId;
        const buyerDoc = doc(firestore, 'users', buyerId);
        await setDoc(buyerDoc, { addresses: updatedAddresses, defaultAddressId: newDefault }, { merge: true });
    }
  }, [firestore, allBuyers]);

  const setBuyerDefaultAddress = useCallback(async (buyerId: string, addressId: string) => {
    if (!firestore) return;
    const buyerDoc = doc(firestore, 'users', buyerId);
    await setDoc(buyerDoc, { defaultAddressId: addressId }, { merge: true });
  }, [firestore]);

  const approvedBuyers = allBuyers.filter((b) => b.status === 'Approved');
  const disabledBuyers = allBuyers.filter((b) => b.status === 'Disabled');

  // === MEDICINES LOGIC ===
  const addMedicine = useCallback(async (medicine: Omit<Medicine, 'id'>) => {
    if (!firestore || !user) return;
    const medicinesCol = collection(firestore, 'drugs');
    return addDoc(medicinesCol, { ...medicine, adminId: user.uid, createdAt: serverTimestamp() });
  }, [firestore, user]);

  const updateMedicine = useCallback(async (medicine: Medicine) => {
    if (!firestore || !user) return;
    const medicineDoc = doc(firestore, 'drugs', medicine.id);
    await setDoc(medicineDoc, { ...medicine, adminId: user.uid, updatedAt: serverTimestamp() }, { merge: true });
  }, [firestore, user]);

  const deleteMedicine = useCallback(async (medicineId: string) => {
    if (!firestore) return;
    const medicineDoc = doc(firestore, 'drugs', medicineId);
    await deleteDoc(medicineDoc);
  }, [firestore]);

  // === CART LOGIC ===
  const addToCart = useCallback((item: Medicine) => {
    if (!firestore) return;

    let updatedCart: CartItem[];
    const existing = cartItems.find((i) => i.id === item.id);
    if (existing) {
      updatedCart = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedCart = [...cartItems, { ...item, quantity: 1 }];
    }
    setCartItems(updatedCart);
    
    if (user) createOrUpdateOrder(updatedCart);
  
    const medicineDoc = doc(firestore, 'drugs', item.id);
    setDoc(medicineDoc, { stock: increment(-1) }, { merge: true });
  }, [cartItems, firestore, createOrUpdateOrder, user]);

  const removeFromCart = useCallback((itemId: string) => {
    if (!firestore) return;

    const itemToRemove = cartItems.find(item => item.id === itemId);
    if (itemToRemove) {
      const medicineDoc = doc(firestore, 'drugs', itemId);
      setDoc(medicineDoc, { stock: increment(itemToRemove.quantity) }, { merge: true });
    }

    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    if (user) createOrUpdateOrder(updatedCart);
  }, [cartItems, firestore, createOrUpdateOrder, user]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (!firestore) return;
    
    let quantityChange = 0;
    const existingItem = cartItems.find((item) => item.id === itemId);
    
    if (existingItem) {
      quantityChange = quantity - existingItem.quantity;
    }

    let updatedCart;
    if (quantity <= 0) {
      updatedCart = cartItems.filter((item) => item.id !== itemId);
    } else {
      updatedCart = cartItems.map((item) => (item.id === itemId ? { ...item, quantity } : item));
    }
    setCartItems(updatedCart);
    if(user) createOrUpdateOrder(updatedCart);
    
    if (quantityChange !== 0) {
        const medicineDoc = doc(firestore, 'drugs', itemId);
        setDoc(medicineDoc, { stock: increment(-quantityChange) }, { merge: true });
    }
  }, [firestore, cartItems, createOrUpdateOrder, user]);
  
  const clearCart = useCallback(async () => {
    if (firestore && cartItems.length > 0) {
        for (const item of cartItems) {
            const medicineDoc = doc(firestore, 'drugs', item.id);
            await setDoc(medicineDoc, { stock: increment(item.quantity) }, { merge: true });
        }
    }
    if (firestore && activeOrderId) {
        const orderRef = doc(firestore, 'orders', activeOrderId);
        await deleteDoc(orderRef);
    }
    setCartItems([]);
    setActiveOrderId(null);
  }, [firestore, cartItems, activeOrderId]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // === ADMINS LOGIC ===
  const getAdmins = useCallback(() => {
      return admins;
  }, [admins]);

  const addPendingAdmin = useCallback(async (adminData: Omit<AdminUser, 'role' | 'permissions' | 'status' | 'id'>) => {
    if (!firestore) return { success: false, error: "Database not connected." };
    
    const adminDocRef = doc(firestore, 'admins', adminData.email);
    const docSnap = await getDoc(adminDocRef);

    if (docSnap.exists()) {
        return { success: false, error: "An admin with this email already exists." };
    }

    const newAdmin: AdminUser = {
        ...adminData,
        role: "Admin",
        permissions: [],
        status: 'Pending' as const,
    };
    
    await setDoc(adminDocRef, newAdmin, { merge: true });

    return { success: true };
  }, [firestore]);

  const updateAdminPermissions = useCallback(async (email: string, permissions: string[]) => {
    if (!firestore) return { success: false, message: 'Database not connected.' };
    const admin = admins.find(a => a.email === email);
    if (admin && admin.role !== 'Super Admin') {
        const adminDoc = doc(firestore, 'admins', email);
        await updateDoc(adminDoc, { permissions });
        return { success: true, message: `Permissions for ${email} updated.` };
    }
    return { success: false, message: 'Admin not found or is a Super Admin.' };
  }, [admins, firestore]);

  const approveAdmin = useCallback(async (email: string) => {
    if (!firestore) return { success: false, error: 'Database not connected.' };
    const admin = admins.find(a => a.email === email);
    if (admin && admin.status === 'Pending') {
        const adminDoc = doc(firestore, 'admins', email);
        await updateDoc(adminDoc, { status: 'Approved', permissions: ['dashboard'] });
        return { success: true, message: `${admin.name} has been approved.` };
    }
    return { success: false, error: 'User not found or not pending.' };
  }, [admins, firestore]);

  const toggleAdminStatus = useCallback(async (email: string, currentStatus: 'Approved' | 'Disabled') => {
      if (!firestore) return { success: false, error: 'Database not connected.' };
      const admin = admins.find(a => a.email === email);
      if (admin && admin.role !== 'Super Admin') {
          const newStatus = currentStatus === 'Approved' ? 'Disabled' : 'Approved';
          const adminDoc = doc(firestore, 'admins', email);
          await updateDoc(adminDoc, { status: newStatus });
          return { success: true, message: `${admin.name}'s account has been ${newStatus.toLowerCase()}.` };
      }
      return { success: false, error: 'User not found or is a Super Admin.' };
  }, [admins, firestore]);

  const updateAdminDetails = useCallback(async (currentEmail: string, details: Partial<AdminUser> & { currentPassword?: string, newPassword?: string }) => {
    if (!firestore) return { success: false, error: "Database not connected." };
    const adminToUpdate = admins.find(a => a.email === currentEmail);
    if(!adminToUpdate) return { success: false, error: "Admin not found." };
    
    // In a real app, password verification would happen on a server
    if (details.newPassword && details.currentPassword !== adminToUpdate.password) {
        return { success: false, error: "Incorrect current password." };
    }
    
    const updates: Partial<AdminUser> = {
        name: details.name || adminToUpdate.name
    };

    if(details.newPassword) {
        updates.password = details.newPassword;
    }
    
    const adminDoc = doc(firestore, 'admins', currentEmail);
    await updateDoc(adminDoc, updates);
    
    return { success: true };
  }, [admins, firestore]);


  // === VALUE FOR PROVIDER ===
  const value: AppContextType = {
    orders,
    addOrder,
    updateOrderStatus,
    buyers: approvedBuyers,
    pendingBuyers,
    disabledBuyers,
    approveBuyer,
    toggleBuyerStatus,
    updateBuyerDetails,
    addBuyerAddress,
    updateBuyerAddress,
    deleteBuyerAddress,
    setBuyerDefaultAddress,
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
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
