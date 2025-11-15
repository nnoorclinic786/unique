

export type Medicine = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  hsnCode?: string;
  priceUnit?: 'strip' | 'piece' | 'bottle';
  companyName?: string;
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
    name: string;
    email: string;
    registeredOn: string;
    gstNumber: string;
    type: 'Chemist' | 'Doctor' | 'Hospital';
    status?: 'Pending' | 'Approved';
};
