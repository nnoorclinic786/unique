
import { cookies } from 'next/headers';
import React from 'react';
import { AdminSearchProvider } from '@/context/admin-search-context';
import AdminClientLayout from './client-layout';

interface AdminSession {
  isLoggedIn: boolean;
  permissions: string[];
}

// This is the layout for all ADMIN pages.
// It checks for authentication and decides whether to show the public view 
// (from the (public) group) or the full authenticated dashboard UI.
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

  // If the user is logged in (session exists and isLoggedIn is true), render the full dashboard layout.
  if (session?.isLoggedIn) {
    const permissions = session?.permissions || [];
    return (
      <AdminSearchProvider>
        <AdminClientLayout permissions={permissions}>{children}</AdminClientLayout>
      </AdminSearchProvider>
    );
  }

  // Otherwise, for public pages (like login/signup), just render the children without the dashboard UI.
  // The (public) group has its own simple layout that will wrap this.
  return (
      <AdminSearchProvider>
        {children}
      </AdminSearchProvider>
  );
}
