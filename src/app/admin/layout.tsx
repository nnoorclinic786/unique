
import { cookies } from 'next/headers';
import React from 'react';
import { AdminSearchProvider } from '@/context/admin-search-context';
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

  // If the user is logged in (session exists and isLoggedIn is true), 
  // render the full dashboard layout which includes the sidebar and header.
  if (session?.isLoggedIn) {
    const permissions = session?.permissions || [];
    return (
      <AdminSearchProvider>
        <AdminClientLayout permissions={permissions}>{children}</AdminClientLayout>
      </AdminSearchProvider>
    );
  }

  // Otherwise, for public pages (like login/signup), just render the page content
  // without the dashboard UI. The public pages live in the (public) route group
  // and will be passed as children here.
  return (
      <AdminSearchProvider>
        {children}
      </AdminSearchProvider>
  );
}
