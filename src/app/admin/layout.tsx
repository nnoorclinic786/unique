
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

  // If there's no valid session, it means we are on a public-facing admin page
  // like login or signup. These pages don't need the full admin UI.
  if (!session?.isLoggedIn) {
    return (
        <AdminSearchProvider>
            {children}
        </AdminSearchProvider>
    );
  }

  // If we have a valid session, render the full admin client layout
  // with sidebar, header, etc.
  const permissions = session.permissions || [];

  return (
    <AdminSearchProvider>
        <AdminClientLayout permissions={permissions}>{children}</AdminClientLayout>
    </AdminSearchProvider>
  );
}
