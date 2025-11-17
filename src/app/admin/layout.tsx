
import React from 'react';
import { cookies } from 'next/headers';
import { AdminSearchProvider } from '@/context/admin-search-context';
import AdminClientLayout from './client-layout';

// This is the root layout for the authenticated /admin section.
// It applies to all private admin pages (dashboard, etc.)
// Public pages like login/signup are handled by the (public) layout.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCookie = cookies().get('admin_session');
  
  // We can assume a session exists here because the middleware will have redirected
  // unauthenticated users.
  const session = JSON.parse(sessionCookie!.value);

  return (
      <AdminSearchProvider>
        <AdminClientLayout permissions={session.permissions}>
          {children}
        </AdminClientLayout>
      </AdminSearchProvider>
  );
}
