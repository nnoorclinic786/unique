
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { MedicineProvider } from '@/context/medicines-context';
import { BuyerProvider } from '@/context/buyers-context';
import { OrderProvider } from '@/context/orders-context';
import { AdminSearchProvider } from '@/context/admin-search-context';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/context/cart-context';
import { SettingsProvider } from '@/context/settings-context';

export const metadata: Metadata = {
  title: 'Unique Medicare',
  description: 'Wholesale medicine for retailers, doctors, and clinics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <SettingsProvider>
          <AdminSearchProvider>
            <OrderProvider>
              <MedicineProvider>
              <BuyerProvider>
                  <CartProvider>
                      <div className="flex-grow">
                          {children}
                      </div>
                  </CartProvider>
              </BuyerProvider>
              </MedicineProvider>
            </OrderProvider>
          </AdminSearchProvider>
        </SettingsProvider>
        <Toaster />
      </body>
    </html>
  );
}
