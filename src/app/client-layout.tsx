
'use client';

import { AppProvider } from '@/context/app-context';
import { Header } from '@/components/header';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <Header />
      <div className="flex-grow">{children}</div>
    </AppProvider>
  );
}
