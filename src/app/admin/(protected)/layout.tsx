
import React from 'react';
import { cookies } from 'next/headers';
import AdminClientLayout from './client-layout';
import { AdminSearchProvider } from '@/context/admin-search-context';
import { redirect } from 'next/navigation';

// This is now a correctly implemented async Server Component
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');

  // Although middleware should protect this, we add a server-side check as a safeguard.
  if (!sessionCookie) {
    redirect('/admin/login');
  }

  // We can now safely parse the session.
  const session = JSON.parse(sessionCookie.value);

  // If for any reason the session is invalid, redirect.
  if (!session?.isLoggedIn) {
     redirect('/admin/login');
  }

  return (
    <AdminSearchProvider>
      {/* We pass the permissions down to the client layout */}
      <AdminClientLayout permissions={session.permissions || []}>
        {children}
      </AdminClientLayout>
    </AdminSearchProvider>
  );
}
