

export type Medicine = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  hsnCode?: string;
  priceUnit?: 'strip' | 'piece' | 'bottle' | 'box';
  stockUnit?: 'strip' | 'piece' | 'bottle' | 'box';
  companyName?: string;
  imageSource?: string;
};

export type Order = {
  id: string;
  buyerName: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  itemCount: number;
};

export type Buyer = {
    id: string;
    name: string; // This can be business name
    email: string;
    registeredOn: string;
    gstNumber?: string;
    type: 'Medical Store' | 'Doctor' | 'Hospital';
    status: 'Pending' | 'Approved' | 'Disabled';
    personName?: string;
    mobileNumber1?: string;
    mobileNumber2?: string;
    address?: string;
    businessLocation?: string;
    doctorRegNumber?: string;
    password?: string;
    // For file uploads, we'll just store a boolean or a path in a real app.
    // For now, we'll omit them from the type as we're not handling file uploads yet.
};

    
