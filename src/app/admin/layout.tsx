
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

  // If there's no session, it means we are on the login/signup page.
  // These pages don't need the full admin UI, but might need the search provider.
  if (!session?.isLoggedIn) {
    return <AdminSearchProvider>{children}</AdminSearchProvider>;
  }

  const permissions = session.permissions || [];

  return (
    <AdminSearchProvider>
      <AdminClientLayout permissions={permissions}>{children}</AdminClientLayout>
    </AdminSearchProvider>
  );
}
