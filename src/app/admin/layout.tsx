
import { cookies } from 'next/headers';
import React from 'react';
import { AdminSearchProvider } from '@/context/admin-search-context';
import AdminClientLayout from './client-layout';

interface AdminSession {
  isLoggedIn: boolean;
  permissions: string[];
}

// This is the layout for all AUTHENTICATED admin pages.
// Public pages like login/signup are in the (public) group and have their own layout.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');
  let session: AdminSession | null = null;
  
  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch {
      session = null;
    }
  }

  const isLoggedIn = session?.isLoggedIn || false;
  const permissions = session?.permissions || [];
  
  return (
    <AdminSearchProvider>
      {isLoggedIn ? (
        <AdminClientLayout permissions={permissions}>{children}</AdminClientLayout>
      ) : (
        children // For public pages, render children directly without dashboard UI
      )}
    </AdminSearchProvider>
  );
}
