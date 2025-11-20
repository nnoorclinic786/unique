

export type Address = {
  id: string;
  name: string; // e.g. "Main Clinic", "Warehouse"
  fullAddress: string;
}

export type Medicine = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  adminId?: string;
  hsnCode?: string;
  priceUnit?: 'strip' | 'piece' | 'bottle' | 'box';
  stockUnit?: 'strip' | 'piece' | 'bottle' | 'box';
  manufacturingCompany?: string;
  marketingCompany?: string;
  imageSource?: string;
  batchNumber?: string;
  expiryDate?: string;
  manufacturingDate?: string;
};

export type Order = {
  id: string;
  buyerName: string;
  buyerId: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  itemCount: number;
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
  email: string;
  name: string;
  role: string;
  permissions: string[];
  status: 'Approved' | 'Pending' | 'Disabled';
  password?: string; // Password should be optional as we won't always have it
};
    
