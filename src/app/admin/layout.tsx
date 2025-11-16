
import React from 'react';
import { AdminSearchProvider } from '@/context/admin-search-context';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminClientLayout from './client-layout';

interface AdminSession {
  isLoggedIn: boolean;
  permissions: string[];
}

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

  // If the user is not logged in, the middleware should have already redirected them.
  // This is a failsafe.
  if (!session?.isLoggedIn) {
    return redirect('/admin/login');
  }
  
  const permissions = session?.permissions || [];

  return (
    <AdminSearchProvider>
      <AdminClientLayout permissions={permissions}>
        {children}
      </AdminClientLayout>
    </AdminSearchProvider>
  );
}
