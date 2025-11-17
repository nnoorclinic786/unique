

import type { Medicine, Order, Buyer, AdminUser } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const placeholderImages = PlaceHolderImages;

export const medicines: Medicine[] = [
  { id: 'PROD001', name: 'Paracetamol 500mg', description: 'Standard analgesic and antipyretic.', price: 15.50, stock: 1200, category: 'Analgesics', imageUrl: placeholderImages.find(img => img.id === 'pills-bottle')?.imageUrl || '', batchNumber: 'P001A', manufacturingDate: '2024-01', expiryDate: '2026-12', manufacturingCompany: 'Cipla', marketingCompany: 'Cipla', priceUnit: 'strip', stockUnit: 'box' },
  { id: 'PROD002', name: 'Amoxicillin 250mg', description: 'Broad-spectrum antibiotic.', price: 45.00, stock: 800, category: 'Antibiotics', imageUrl: placeholderImages.find(img => img.id === 'capsules')?.imageUrl || '', batchNumber: 'A002B', manufacturingDate: '2023-09', expiryDate: '2025-08', manufacturingCompany: 'Sun Pharma', marketingCompany: 'Sun Pharma', priceUnit: 'strip', stockUnit: 'box' },
  { id: 'PROD003', name: 'Cough Syrup 100ml', description: 'For relief from cough and cold.', price: 75.00, stock: 650, category: 'Respiratory', imageUrl: placeholderImages.find(img => img.id === 'syrup')?.imageUrl || '', batchNumber: 'CS003C', manufacturingDate: '2023-12', expiryDate: '2025-11', manufacturingCompany: 'Dr. Reddy\'s', marketingCompany: 'Dr. Reddy\'s', priceUnit: 'bottle', stockUnit: 'bottle' },
  { id: 'PROD004', name: 'Antacid Gel 170ml', description: 'For heartburn and indigestion.', price: 60.25, stock: 900, category: 'Gastrointestinal', imageUrl: placeholderImages.find(img => img.id === 'syrup')?.imageUrl || '', batchNumber: 'AG004D', manufacturingDate: '2024-05', expiryDate: '2026-04', manufacturingCompany: 'Abbott', marketingCompany: 'Abbott', priceUnit: 'bottle', stockUnit: 'bottle' },
  { id: 'PROD005', name: 'Diclofenac Gel 30g', description: 'Topical pain relief gel.', price: 55.00, stock: 750, category: 'Topical', imageUrl: placeholderImages.find(img => img.id === 'ointment-tube')?.imageUrl || '', batchNumber: 'DG005E', manufacturingDate: '2024-02', expiryDate: '2027-01', manufacturingCompany: 'Mankind', marketingCompany: 'Mankind', priceUnit: 'piece', stockUnit: 'piece' },
  { id: 'PROD006', name: 'Salbutamol Inhaler', description: 'For asthma and COPD relief.', price: 120.00, stock: 400, category: 'Respiratory', imageUrl: placeholderImages.find(img => img.id === 'inhaler')?.imageUrl || '', batchNumber: 'SI006F', manufacturingDate: '2023-10', expiryDate: '2025-09', manufacturingCompany: 'Cipla', marketingCompany: 'GSK', priceUnit: 'piece', stockUnit: 'piece' },
  { id: 'PROD007', name: 'Vitamin C 500mg', description: 'Immunity booster supplement.', price: 30.00, stock: 2500, category: 'Vitamins', imageUrl: placeholderImages.find(img => img.id === 'pills-bottle')?.imageUrl || '', batchNumber: 'VC007G', manufacturingDate: '2024-07', expiryDate: '2027-06', manufacturingCompany: 'Lupin', marketingCompany: 'Lupin', priceUnit: 'strip', stockUnit: 'box' },
  { id: 'PROD008', name: 'Insulin Injection', description: 'For management of diabetes.', price: 450.00, stock: 200, category: 'Endocrine', imageUrl: placeholderImages.find(img => img.id === 'vaccine-vial')?.imageUrl || '', batchNumber: 'IN008H', manufacturingDate: '2023-06', expiryDate: '2025-05', manufacturingCompany: 'Novo Nordisk', marketingCompany: 'Novo Nordisk', priceUnit: 'piece', stockUnit: 'piece' },
];

export const orders: Order[] = [
  { id: 'ORD-2407-001', buyerName: 'City Pharmacy', date: '2024-07-20', total: 1850.50, status: 'Delivered', itemCount: 5 },
  { id: 'ORD-2407-002', buyerName: 'Dr. Anita Sharma', date: '2024-07-21', total: 750.00, status: 'Shipped', itemCount: 3 },
  { id: 'ORD-2407-003', buyerName: 'Wellness Hospital', date: '2024-07-21', total: 12400.00, status: 'Processing', itemCount: 12 },
  { id: 'ORD-2407-004', buyerName: 'QuickMed Retail', date: '2024-07-22', total: 3200.75, status: 'Pending', itemCount: 8 },
  { id: 'ORD-2407-005', buyerName: 'Central Clinic', date: '2024-07-22', total: 990.00, status: 'Delivered', itemCount: 4 },
  { id: 'ORD-2407-006', buyerName: 'City Pharmacy', date: '2024-07-23', total: 2100.00, status: 'Pending', itemCount: 6 },
  { id: 'ORD-2407-007', buyerName: 'Wellness Hospital', date: '2024-07-23', total: 8500.00, status: 'Cancelled', itemCount: 9 },
  // Adding more data for better chart
  { id: 'ORD-2406-001', buyerName: 'City Pharmacy', date: '2024-06-15', total: 3200.00, status: 'Delivered', itemCount: 7 },
  { id: 'ORD-2406-002', buyerName: 'Dr. Anita Sharma', date: '2024-06-20', total: 1200.00, status: 'Delivered', itemCount: 2 },
  { id: 'ORD-2405-001', buyerName: 'Wellness Hospital', date: '2024-05-10', total: 15000.00, status: 'Delivered', itemCount: 20 },
  { id: 'ORD-2404-001', buyerName: 'QuickMed Retail', date: '2024-04-25', total: 4500.00, status: 'Delivered', itemCount: 10 },
  { id: 'ORD-2403-001', buyerName: 'Central Clinic', date: '2024-03-18', total: 2500.00, status: 'Delivered', itemCount: 5 },
];

const initialShippingAddresses = [
    { id: 'addr-1', name: 'Main Branch', fullAddress: '123, Main Street, Farrukhabad, Uttar Pradesh - 209625' },
    { id: 'addr-2', name: 'Warehouse', fullAddress: '456, Industrial Area, Farrukhabad, Uttar Pradesh - 209626' }
];


export const buyers: Buyer[] = [
    { id: 'BUY001', name: 'City Pharmacy', email: 'contact@citypharm.com', password: 'password123', registeredOn: '2023-01-15', gstNumber: '29ABCDE1234F1Z5', type: 'Medical Store', status: 'Approved', permanentAddress: '123 Business Rd, Farrukhabad, UP - 209625', addresses: [initialShippingAddresses[0]], defaultAddressId: 'addr-1' },
    { id: 'BUY002', name: 'Dr. Anita Sharma', email: 'anita.sharma@clinic.com', password: 'password123', registeredOn: '2023-02-20', gstNumber: '07HIJKL6789M1Z2', type: 'Doctor', status: 'Approved', permanentAddress: 'Clinic Building, Health Ave, Farrukhabad, UP - 209625', addresses: [{ id: 'addr-3', name: 'Clinic', fullAddress: '789 Health Ave, Farrukhabad, Uttar Pradesh - 209625' }], defaultAddressId: 'addr-3'},
    { id: 'BUY003', name: 'Wellness Hospital', email: 'procurement@wellness.com', password: 'password123', registeredOn: '2022-11-10', gstNumber: '27NOPQR2468T1Z4', type: 'Hospital', status: 'Approved', permanentAddress: '10 Wellness Way, Farrukhabad, UP - 209625', addresses: initialShippingAddresses, defaultAddressId: 'addr-2' },
    { id: 'BUY004', name: 'QuickMed Retail', email: 'orders@quickmed.com', password: 'password123', registeredOn: '2023-05-01', gstNumber: '36UVWXY9876P1Z9', type: 'Medical Store', status: 'Pending', permanentAddress: 'Shop 42, Market Place, Farrukhabad, UP - 209625' },
    { id: 'BUY005', name: 'Central Clinic', email: 'admin@centralclinic.org', password: 'password123', registeredOn: '2023-06-25', gstNumber: '21GHIJK1357S1Z7', type: 'Hospital', status: 'Pending', permanentAddress: '5 Central Road, Farrukhabad, UP - 209625' },
    { id: 'BUY006', name: 'HealthFirst Pharma', email: 'contact@healthfirst.com', password: 'password123', registeredOn: '2023-03-12', gstNumber: '33AAAAA1111B1Z5', type: 'Medical Store', status: 'Disabled', permanentAddress: '9 Pharma Lane, Farrukhabad, UP - 209625' },
];

export const admins: AdminUser[] = [
    { email: "superadmin@medicare.com", password: "superadminpassword", role: "Super Admin", name: "Super Admin", permissions: ['dashboard', 'orders', 'drugs', 'buyers', 'manage_admins', 'settings'], status: 'Approved' },
    { email: "admin@medicare.com", password: "adminpassword", role: "Admin", name: "Admin User", permissions: ['dashboard', 'orders'], status: 'Approved' },
    { email: "testadmin@medicare.com", password: "testpassword", role: "Admin", name: "Test Admin", permissions: ['dashboard', 'drugs'], status: 'Approved' },
    { email: "pending@medicare.com", password: "pendingpassword", role: "Admin", name: "Pending User", permissions: [], status: 'Pending' }
];

// This static data is no longer used by the dashboard.
export const salesData = [
  { month: 'January', sales: 4000 },
  { month: 'February', sales: 3000 },
  { month: 'March', sales: 5000 },
  { month: 'April', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'June', sales: 5500 },
];
