import type { placeholderImages } from './data';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageId: (typeof placeholderImages)[number]['id'];
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
};
