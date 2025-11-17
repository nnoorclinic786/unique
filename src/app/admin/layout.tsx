
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminSearchProvider } from '@/context/admin-search-context';
import AdminClientLayout from './client-layout';

// This is the root layout for the /admin section.
// It applies to both public (login, signup) and private (dashboard, etc.) pages.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCookie = cookies().get('admin_session');
  
  let session;
  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (e) {
      session = null;
      // Malformed cookie, let middleware handle redirect
    }
  }

  // If there's a valid session, render the full admin dashboard UI
  // and pass the permissions to the client layout.
  if (session?.isLoggedIn && session?.permissions) {
    return (
        <AdminSearchProvider>
          <AdminClientLayout permissions={session.permissions}>
            {children}
          </AdminClientLayout>
        </AdminSearchProvider>
    );
  }

  // If there is no session, we are on a public page (login/signup),
  // so just render the children for that page.
  return (
      <AdminSearchProvider>
        {children}
      </AdminSearchProvider>
  );
}
