

export type Address = {
  id: string;
  name: string; 
  fullAddress: string;
}

export type Medicine = {
  id: string; 
  name: string;
  description: string;
  dosage: string;
  price: number;
  stockLevel: number;
  manufacturer: string;
  prescriptionRequired: boolean;
  category: string;
  activeIngredient: string;
};

export type OrderItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export type Order = {
  id: string;
  buyerId: string;
  date: string;
  total: number;
  status: 'Pending Verification' | 'Verified' | 'Awaiting Payment' | 'Paid' | 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  itemCount: number;
  paymentMode: string;
  prescriptionImageUrl?: string;
  prescriptionPatientName?: string;
  prescriptionDoctorName?: string;
  prescriptionDate?: string;
  items?: OrderItem[];
};

export type Buyer = {
    id: string;
    email: string;
    name: string;
    addresses?: Address[];
    defaultAddressId?: string;
    password?: string; // Should not be stored plaintext
};

export type AdminUser = {
  id?: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'Worker';
  permissions: string[];
  status: 'Approved' | 'Pending' | 'Disabled';
  password?: string;
};

export type Worker = {
    id: string;
    email: string;
    name: string;
    role: 'Pharmacist' | 'Stock Manager' | 'Delivery Person';
    permissions: string[];
};

    
