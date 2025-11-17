
import React from 'react';
import { cookies } from 'next/headers';
import AdminClientLayout from './client-layout';
import { AdminSearchProvider } from '@/context/admin-search-context';
import { AppProvider } from '@/context/app-context';

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCookie = cookies().get('admin_session');
  // We can safely assume the cookie exists and is valid
  // because the middleware is protecting this route group.
  const session = JSON.parse(sessionCookie!.value);

  return (
    <AppProvider>
      <AdminSearchProvider>
        <AdminClientLayout permissions={session.permissions || []}>
          {children}
        </AdminClientLayout>
      </AdminSearchProvider>
    </AppProvider>
  );
}
