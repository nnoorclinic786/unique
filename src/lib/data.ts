
import type { Medicine, Order, Buyer } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const placeholderImages = PlaceHolderImages;

export const medicines: Medicine[] = [
  { id: 'PROD001', name: 'Paracetamol 500mg', description: 'Standard analgesic and antipyretic.', price: 15.50, stock: 1200, category: 'Analgesics', imageUrl: placeholderImages.find(img => img.id === 'pills-bottle')?.imageUrl || '' },
  { id: 'PROD002', name: 'Amoxicillin 250mg', description: 'Broad-spectrum antibiotic.', price: 45.00, stock: 800, category: 'Antibiotics', imageUrl: placeholderImages.find(img => img.id === 'capsules')?.imageUrl || '' },
  { id: 'PROD003', name: 'Cough Syrup 100ml', description: 'For relief from cough and cold.', price: 75.00, stock: 650, category: 'Respiratory', imageUrl: placeholderImages.find(img => img.id === 'syrup')?.imageUrl || '' },
  { id: 'PROD004', name: 'Antacid Gel 170ml', description: 'For heartburn and indigestion.', price: 60.25, stock: 900, category: 'Gastrointestinal', imageUrl: placeholderImages.find(img => img.id === 'syrup')?.imageUrl || '' },
  { id: 'PROD005', name: 'Diclofenac Gel 30g', description: 'Topical pain relief gel.', price: 55.00, stock: 750, category: 'Topical', imageUrl: placeholderImages.find(img => img.id === 'ointment-tube')?.imageUrl || '' },
  { id: 'PROD006', name: 'Salbutamol Inhaler', description: 'For asthma and COPD relief.', price: 120.00, stock: 400, category: 'Respiratory', imageUrl: placeholderImages.find(img => img.id === 'inhaler')?.imageUrl || '' },
  { id: 'PROD007', name: 'Vitamin C 500mg', description: 'Immunity booster supplement.', price: 30.00, stock: 2500, category: 'Vitamins', imageUrl: placeholderImages.find(img => img.id === 'pills-bottle')?.imageUrl || '' },
  { id: 'PROD008', name: 'Insulin Injection', description: 'For management of diabetes.', price: 450.00, stock: 200, category: 'Endocrine', imageUrl: placeholderImages.find(img => img.id === 'vaccine-vial')?.imageUrl || '' },
];

export const orders: Order[] = [
  { id: 'ORD-2407-001', buyerName: 'City Pharmacy', date: '2024-07-20', total: 1850.50, status: 'Delivered', itemCount: 5 },
  { id: 'ORD-2407-002', buyerName: 'Dr. Anita Sharma', date: '2024-07-21', total: 750.00, status: 'Shipped', itemCount: 3 },
  { id: 'ORD-2407-003', buyerName: 'Wellness Hospital', date: '2024-07-21', total: 12400.00, status: 'Processing', itemCount: 12 },
  { id: 'ORD-2407-004', buyerName: 'QuickMed Retail', date: '2024-07-22', total: 3200.75, status: 'Pending', itemCount: 8 },
  { id: 'ORD-2407-005', buyerName: 'Central Clinic', date: '2024-07-22', total: 990.00, status: 'Delivered', itemCount: 4 },
  { id: 'ORD-2407-006', buyerName: 'City Pharmacy', date: '2024-07-23', total: 2100.00, status: 'Pending', itemCount: 6 },
  { id: 'ORD-2407-007', buyerName: 'Wellness Hospital', date: '2024-07-23', total: 8500.00, status: 'Cancelled', itemCount: 9 },
];

export const buyers: Buyer[] = [
    { id: 'BUY001', name: 'City Pharmacy', email: 'contact@citypharm.com', registeredOn: '2023-01-15', gstNumber: '29ABCDE1234F1Z5', type: 'Medical Store', status: 'Approved' },
    { id: 'BUY002', name: 'Dr. Anita Sharma', email: 'anita.sharma@clinic.com', registeredOn: '2023-02-20', gstNumber: '07HIJKL6789M1Z2', type: 'Doctor', status: 'Approved' },
    { id: 'BUY003', name: 'Wellness Hospital', email: 'procurement@wellness.com', registeredOn: '2022-11-10', gstNumber: '27NOPQR2468T1Z4', type: 'Hospital', status: 'Approved' },
    { id: 'BUY004', name: 'QuickMed Retail', email: 'orders@quickmed.com', registeredOn: '2023-05-01', gstNumber: '36UVWXY9876P1Z9', type: 'Medical Store', status: 'Pending' },
    { id: 'BUY005', name: 'Central Clinic', email: 'admin@centralclinic.org', registeredOn: '2023-06-25', gstNumber: '21GHIJK1357S1Z7', type: 'Hospital', status: 'Pending' },
    { id: 'BUY006', name: 'HealthFirst Pharma', email: 'contact@healthfirst.com', registeredOn: '2023-03-12', gstNumber: '33AAAAA1111B1Z5', type: 'Medical Store', status: 'Disabled' },
];

export const salesData = [
  { month: 'January', sales: 4000 },
  { month: 'February', sales: 3000 },
  { month: 'March', sales: 5000 },
  { month: 'April', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'June', sales: 5500 },
];
