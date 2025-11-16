
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

  const isLoggedIn = session?.isLoggedIn || false;
  const permissions = session?.permissions || [];
  
  // If the user is logged in, render the full dashboard layout.
  // Otherwise, just render the children (which will be the public login/signup page).
  if (isLoggedIn) {
    return (
      <AdminSearchProvider>
        <AdminClientLayout permissions={permissions}>{children}</AdminClientLayout>
      </AdminSearchProvider>
    );
  }

  // For public pages, render children directly without the dashboard UI.
  // The (public) group has its own layout that will wrap this.
  return <>{children}</>;
}
