
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AdminSearchProvider } from '@/context/admin-search-context';
import { AppProvider } from '@/context/app-context';

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
        <AdminSearchProvider>
          <AppProvider>
            <div className="flex-grow">{children}</div>
          </AppProvider>
        </AdminSearchProvider>
        <Toaster />
      </body>
    </html>
  );
}
