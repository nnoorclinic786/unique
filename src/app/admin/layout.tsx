
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
  
  // If we are on a public page (no session cookie needed), just render the children.
  // The middleware handles redirecting logged-in users away from public pages.
  if (!sessionCookie) {
    return (
      <AdminSearchProvider>
        {children}
      </AdminSearchProvider>
    );
  }

  let session;
  try {
    session = JSON.parse(sessionCookie.value);
  } catch (e) {
    // If cookie is malformed, treat as logged out and redirect.
    // This case is unlikely if middleware is correct, but good for safety.
    redirect('/admin/login');
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

  // Fallback for any other case is to just render the children (e.g., login page)
  return <AdminSearchProvider>{children}</AdminSearchProvider>;
}
