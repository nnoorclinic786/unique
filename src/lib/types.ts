
export type Address = {
  id: string;
  name: string; // e.g. "Main Clinic", "Warehouse"
  fullAddress: string;
}

export type MedicineBatch = {
  id: string; // Will be batch number or a unique ID
  batchNumber: string;
  price: number;
  stock: number;
  expiryDate: string;
  manufacturingDate?: string;
  priceUnit: 'strip' | 'piece' | 'bottle' | 'box';
  stockUnit: 'strip' | 'piece' | 'bottle' | 'box';
}

export type Medicine = {
  id: string; // Represents the core product
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  adminId: string;
  hsnCode?: string;
  manufacturingCompany?: string;
  marketingCompany?: string;
  imageSource?: string;
  // Aggregated/default values - Batches will have specific overrides
  totalStock: number;
  defaultPrice: number;
  batches: MedicineBatch[];
};

export type OrderItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    batchNumber: string; // Track which batch was ordered
}

export type Order = {
  id: string;
  buyerName: string;
  buyerId: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'draft';
  itemCount: number;
  paymentMode: string;
  items?: OrderItem[];
};

export type Buyer = {
    id: string;
    name: string; // This can be business name
    businessName?: string;
    email: string;
    registeredOn: string;
    gstNumber?: string;
    type: 'Medical Store' | 'Doctor' | 'Hospital';
    status: 'Pending' | 'Approved' | 'Disabled';
    personName?: string;
    mobileNumber1?: string;
    mobileNumber2?: string;
    permanentAddress?: string;
    addresses?: Address[];
    defaultAddressId?: string;
    doctorRegNumber?: string;
    password?: string;
    // For file uploads, we'll just store a boolean or a path in a real app.
    // For now, we'll omit them from the type as we're not handling file uploads yet.
};

export type AdminUser = {
  id?: string; // Add optional id for firestore documents
  email: string;
  name: string;
  role: string;
  permissions: string[];
  status: 'Approved' | 'Pending' | 'Disabled';
  password?: string; // Password should be optional as we won't always have it
};

